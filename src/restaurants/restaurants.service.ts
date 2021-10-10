import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RestaurantsInput, RestaurantsOutput } from 'src/common/dto/restaurants.dto';
import { User } from 'src/users/enities/user.entity';
import { Like, Raw, Repository } from 'typeorm';
import { AllCategoriesOutput } from './dto/all-categories.dto';
import { CategoryInput, CategoryOutput } from './dto/category.dto';
import { CreateDishInput, CreateDishOutput } from './dto/create-dish.dto';
import { CreateRestaurantInput, CreateRestaurantOutput } from './dto/create-restaurant.dto';
import { DeleteDishInput, DeleteDishOutput } from './dto/delete-dish.dto';
import { DeleteRestaurantInput, DeleteRestaurantOutput } from './dto/delete-restaurant.dto';
import { EditDishInput, EditDishOutput } from './dto/edit-dish.dto';
import { EditRestaurantInput, EditRestaurantOutput } from './dto/edit-restaurant.dto';
import { RestaurantInput, RestaurantOutput } from './dto/restaurant.dto';
import { SearchRestaurantInput, SearchRestaurantOutput } from './dto/search-restaurant.dto';
import { Category } from './enities/category.enities';
import { Dish } from './enities/dish.entities';
import { Restaurant } from './enities/restaurant.enities';
import { CategoryRepository } from './repositories/category.repository';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,
    @InjectRepository(Dish)
    private readonly dishes: Repository<Dish>,
    private readonly categories: CategoryRepository,
  ) {}

  public async createRestaurant(
    owner: User,
    createRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {

    try {
      const newRestaurant = this.restaurants.create(createRestaurantInput);
      newRestaurant.owner = owner;
      const category = await this.categories.getOrCreate(
        createRestaurantInput.categoryName
      ) 
      newRestaurant.category = category;  
      await this.restaurants.save(newRestaurant);
      return {
        ok: true
      }
    } catch (error) {
      return {
        ok: false,
        error: "Не смог создать ресторан"
      }
    }
  }

  /**
   * editRestaurant
   */
  public async editRestaurant(owner: User, editRestaurantInput: EditRestaurantInput): Promise<EditRestaurantOutput> {

      try {
        const restaurant = await this.restaurants.findOne(
          editRestaurantInput.restaurantId, 
          {loadRelationIds: true}
          );
        
          if(!restaurant){
             return {
               ok: false,
               error: "Restaurant не существует"
             }
          };

        if(owner.id !== restaurant.ownerId) {
          return {
            ok: false,
            error: 'Вы не можете редактировать ресторан, который вам не принадлежит'
          }
        }

        let category: Category = null;
        if(editRestaurantInput.categoryName){
          category = await this.categories.getOrCreate(editRestaurantInput.categoryName)
        }
        await this.restaurants.save([{
          id: editRestaurantInput.restaurantId,
          ...editRestaurantInput,
          ...(category && { category }) /// !!!
        }])
        return {
          ok: true
        }
        
      } catch (error) {
        return {
          ok: false,
          error: 'Не удалось создать Restaurant'
        }
      };

  }

  public async deleteRestaurant(
    owner: User, 
    // deleteRestaurantInput: DeleteRestaurantInput
    { restaurantId }: DeleteRestaurantInput
    ): Promise<DeleteRestaurantOutput> {
        try {
          const restaurant = await this.restaurants.findOne(
            restaurantId, 
          );
          
            if(!restaurant){
               return {
                 ok: false,
                 error: "Restaurant не существует"
               }
            };
  
          if(owner.id !== restaurant.ownerId) {
            return {
              ok: false,
              error: 'Вы не можете удалить ресторан, который вам не принадлежит'
            }
          };
          await this.restaurants.delete(restaurantId)
          return {
            ok: true
          }
        } catch (error) {
         return {
           ok: false,
           error: "Не получилось удалить ресторан"
         } 
        }
   }

   /**
    * allCategories
    */
   public async allCategories(): Promise<AllCategoriesOutput> {
     try {
       const categories = await this.categories.find()
       return {
         ok: true,
         categories
       }
     } catch (error) {
       return {
         ok: false,
         error: "Не удалось загрузить сатегории"
       }
     }
   }

  public countRestaurant(category: Category) {
    return this.restaurants.count({ category })
  } 

  public async findCategoryBySlug({ slug, page }: CategoryInput): Promise<CategoryOutput>{
    try {
      const category = await this.categories.findOne(
        { slug },
        // { relations: ['restaurants'] } // !!! 
        )
      if(!category){
        return {
          ok: false,
          error: "Категории не существует"
        }        
      };

      const restaurants = await this.restaurants.find({ /// !!! pagination
         where: {
          category
        },
        order: {
          isPromoted: 'DESC'
        },
        take: 25,
        skip: (page - 1) * 25
      });

      category.restaurants = restaurants;
      const totalResult = await this.countRestaurant(category)

      return {
        ok: true,
        category,
        totalPages: Math.ceil(totalResult / 25)
      }
    } catch (error) {
      return {
        ok: false,
        error: "Не удалось загрузить категории"
      }
    }
  }

  public async allRestaurants(
    { page }: RestaurantsInput
  ): Promise<RestaurantsOutput> {
    
    try {
      const [restaurants, totalResult] = await this.restaurants.findAndCount({
        skip: (page - 1) * 25,
        take: 25,
        order: {
          isPromoted: 'DESC'
        }
      });

      return {
        ok: true,
        results: restaurants,
        totalPages: Math.ceil(totalResult / 25),
        totalResult
      }
    } catch (error) {
      return {
        ok: false,
        error: "Неудалось загрузить рестараны"
      }      
    }
  }

  public async findRestaurantById(
    { restaurantId }: RestaurantInput
  ): Promise<RestaurantOutput> {
    try {
      const restaurant = await this.restaurants.findOne(restaurantId, {
        relations: ['menu']
      });
      if(!restaurant){
        return {
          ok: false,
          error: 'Рестаран не существует'
        }
      }
      return {
        ok: true,
        restaurant
      }
    } catch (error) {
      return {
        ok: false,
        error: 'Рестаран не существует'
      }
    }
  }

  public async findRestaurantByName({ query, page }: SearchRestaurantInput): Promise<SearchRestaurantOutput>{
    try {
      const [restaurants, totalResult] = await this.restaurants.findAndCount({
        where: {
          name: Raw(name => `${name} ILIKE '%${query}%'`) // !!!
        },
        skip: (page - 1) * 25,
        take: 25 
      });
      return {
        ok: true,
        restaurants,
        totalResult,
        totalPages: Math.ceil(totalResult / 25),
      }
    } catch (error) {
      return {
        ok: false,
        error: 'Ресторан не найден'
      }
    }
  }

  public async createDish(
    owner: User, 
    createDishInput: CreateDishInput
    ): Promise<CreateDishOutput> {
      try {
        const restaurant = await this.restaurants.findOne(
          createDishInput.restaurantId
        );
        if(!restaurant) {
          return {
            ok: false,
            error: "Расторан не найден"
          };
        }
        if(owner.id !== restaurant.ownerId){
          return {
            ok: false,
            error: "Вы не можете этого сделать"
          }
        }
  
       await this.dishes.save(this.dishes.create({...createDishInput, restaurant}))
        
        return{
          ok: true
        }
      } catch (error) {
        console.log(error);
        
        return{
          ok: false,
          error: "Блюдо не создано"
        }
      }
  }

  public async editDish(
    owner: User, 
    editDishInput: EditDishInput
    ): Promise<EditDishOutput> {
      try {
        const dish = await this.dishes.findOne(editDishInput.dishId, {
          relations: ['restaurant']
        })
        if(!dish) {
          return {
            ok: false,
            error: "Блюдо не найдено"
          };
        }
  
        if(dish.restaurant.ownerId !== owner.id) {
          return {
            ok: false,
            error: "You cant do that."
          };
        }
        await this.dishes.save([{
          id: editDishInput.dishId,
          ...editDishInput,
        }])
      } catch (error) {
        return {
          ok: false,
          error: "Не получилось удалить блюдо"
        }
      }
    
    }

    public async deleteDish(
      owner: User, 
      // createDishInput: DeleteDishInput
      { dishId }: DeleteDishInput
      ): Promise<DeleteDishOutput> {
        try {
          const dish = await this.dishes.findOne(dishId, {
            relations: ['restaurant']
          })
          if(!dish) {
            return {
              ok: false,
              error: "Блюдо не найдено"
            };
          }
    
          if(dish.restaurant.ownerId !== owner.id) {
            return {
              ok: false,
              error: "You cant do that."
            };
          }
          await this.dishes.delete(dishId)
          return {
            ok: true
          }
        } catch (error) {
          return {
            ok: false,
            error: "Не получилось удалить блюдо"
          }
        }
    }
}




  // public getAll(): Promise<Restaurant[]> {
  //   return this.restaurants.find();
  // }
  
  // public async getOrCreateCategory(name: string): Promise<Category> {
  //   const categoryName = name.trim().toLocaleLowerCase();
  //   const categorySlug = categoryName.replace(/ /g, "-")
  //   let category = await this.categories.findOne({ slug: categorySlug })
  //   if(!category){
  //     category = await this.categories.save(
  //       this.categories.create({ slug: categorySlug, name: categoryName })
  //     );
  //   }
  //   return category;
  // }


    // public updateRestaurant({ id, data }: UpdateRestaurantDto) {
  //   return this.restaurants.update(id, { ...data });
  // }