import { EntityRepository, Repository } from "typeorm";
import { Category } from "../enities/category.enities";

@EntityRepository(Category)
export class CategoryRepository extends Repository<Category>{
    public async getOrCreate(name: string): Promise<Category> {
        const categoryName = name.trim().toLocaleLowerCase();
        const categorySlug = categoryName.replace(/ /g, "-")
        let category = await this.findOne({where:{ slug: categorySlug } })
        if(!category){
          category = await this.save(
            this.create({ slug: categorySlug, name: categoryName })
          );
        }
        return category;
      }
}