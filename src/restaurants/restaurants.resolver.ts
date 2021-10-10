import { Resolver, Args, Mutation, Query, ResolveField, Int, Parent } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { RestaurantsInput, RestaurantsOutput } from 'src/common/dto/restaurants.dto';
import { User } from 'src/users/enities/user.entity';
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
import { RestaurantService } from './restaurants.service';

@Resolver(of => Restaurant)
export class RestaurantResolver {
  constructor(private readonly restaurauntService: RestaurantService) {}

  // @Query((returns) => [Restaurant])
  // public restaurant(): Promise<Restaurant[]> {
  //   return this.restaurauntService.getAll();
  // }

  @Mutation(returns => CreateRestaurantOutput)
  @Role(['Owner'])
  public async createRestaurant(
    @AuthUser() authUser: User,
    @Args('input') createRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
      return this.restaurauntService.createRestaurant(
        authUser, 
        createRestaurantInput
      );
  }

   @Mutation(returns => EditRestaurantOutput)
   @Role(["Owner"])
   public editRestaurant(
     @AuthUser() owner: User,
     @Args('input') editRestaurantInput: EditRestaurantInput
   ): Promise<EditRestaurantOutput> {
     return this.restaurauntService.editRestaurant(owner, editRestaurantInput)
    //  return { ok: true }
   }

   @Mutation(returns => DeleteRestaurantOutput)
   @Role(["Owner"])
   public deleteRestaurant(
     @AuthUser() owner: User,
     @Args('input') deleteRestaurantInput: DeleteRestaurantInput
   ): Promise<DeleteRestaurantOutput>{
      return this.restaurauntService.deleteRestaurant(owner, deleteRestaurantInput);
   }

   @Query(returns => RestaurantOutput)
   restaurant(
     @Args('input') restaurantInput: RestaurantInput
   ): Promise<RestaurantOutput> {
    return this.restaurauntService.findRestaurantById(restaurantInput)
   }
}


@Resolver(of => Category)
export class CategoryResolver {
  constructor(private readonly restaurauntService: RestaurantService) {}

  @ResolveField(type => Int)
  restaurantCount(@Parent() category: Category): Promise<number> {
    return this.restaurauntService.countRestaurant(category)
  }

  @Query(type => AllCategoriesOutput)
  public allCategories(): Promise<AllCategoriesOutput> {
    return this.restaurauntService.allCategories();
  }

  @Query(type => CategoryOutput)
  public category(@Args('input') categoryInput: CategoryInput): Promise<CategoryOutput>{
    return this.restaurauntService.findCategoryBySlug(categoryInput)
  }

  @Query(returns => RestaurantsOutput)
  restaurants(@Args('input') restaurantsInput: RestaurantsInput): Promise<RestaurantsOutput>{
    return this.restaurauntService.allRestaurants(restaurantsInput)
  }

  @Query(returns => RestaurantOutput)
  public restaurant(
    @Args('input') restaurantInput: RestaurantInput 
  ): Promise<RestaurantOutput> {
    return this.restaurauntService.findRestaurantById(restaurantInput)
  }

  @Query(returns => SearchRestaurantOutput)
  public searchRestaurant(
    @Args('input') searchRestaurantInput: SearchRestaurantInput 
  ): Promise<SearchRestaurantOutput> {
    return this.restaurauntService.findRestaurantByName(searchRestaurantInput)
  }
}


@Resolver(of => Dish)
export class DishResolver {
  constructor(private readonly restaurauntService: RestaurantService) {}

  @Mutation(type => CreateDishOutput)
  @Role(["Owner"])
  public createDish(
    @AuthUser() owner: User,
    @Args('input') createDishInput: CreateDishInput 
    ): Promise<CreateDishOutput>{
      return this.restaurauntService.createDish(owner, createDishInput)
  }

  @Mutation(type => EditDishOutput)
  @Role(["Owner"])
  public editDish(
    @AuthUser() owner: User,
    @Args('input') editDishInput: EditDishInput 
    ): Promise<EditDishOutput>{
      return this.restaurauntService.editDish(owner, editDishInput)
  }

  @Mutation(type => DeleteDishOutput)
  @Role(["Owner"])
  public deleteDish(
    @AuthUser() owner: User,
    @Args('input') deleteDishInput: DeleteDishInput 
    ): Promise<DeleteDishOutput>{
      return this.restaurauntService.deleteDish(owner, deleteDishInput)
  }
}









  // @Mutation((returns) => Boolean)
  // async updateRestaurant(
  //   @Args('input') updateRestaurantDto: UpdateRestaurantDto,
  // ): Promise<boolean> {
  //   try {
  //     await this.restaurauntService.updateRestaurant(updateRestaurantDto);
  //     return true;
  //   } catch (error) {
  //     console.log(error);
  //     return false;
  //   }
  // }