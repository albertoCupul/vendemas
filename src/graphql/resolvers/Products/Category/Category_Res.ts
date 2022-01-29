/* Aqui se declaran los resolvers (query and mutations) del servidor */
import { Resolver, Query, Mutation, Arg, Args, Int } from "type-graphql";

import {
  CategoryModel,
  CategoryMain,
  CategoryResponse,
  InputCategory,
  UpdateCategory,
} from "../../../../typegoose/schemas/Products/Category/categorySchema";

import {
  CategoryResponseFix,
  CategoryArrayResponseFix,
} from "../../../../typegoose/schemas/Products/Category/middleware";

import { categoryMain } from "../../../../DefaultSettings/defaultValues";

@Resolver(CategoryMain)
export class CategoryResolver {
  @Query((returns) => [CategoryResponse])
  async QueryCategoryByName(
    @Arg("name") name: string
  ): Promise<CategoryResponse[]> {
    const category = await CategoryModel.find({
      name: { $regex: name, $options: "i" },
    });

    const response: Array<CategoryResponse> =
      CategoryArrayResponseFix(category);
    return response;
  }

  @Query((returns) => CategoryResponse)
  async QueryCategoryById(@Arg("id") id: string): Promise<CategoryResponse> {
    const category = await CategoryModel.findById(id);
    const response: CategoryResponse = CategoryResponseFix(category);
    return response;
  }

  @Mutation((returns) => CategoryResponse)
  async AddCategory(
    @Args() { name }: InputCategory
  ): Promise<CategoryResponse> {
    let category = new CategoryModel();
    let response: CategoryResponse;
    const existCategory = await CategoryModel.findOne({ name });
    if (!existCategory) {
      const editable = true;
      await category.CreateUpdateCategory({ name, editable });
      category = await CategoryModel.findById(category._id.valueOf());
      response = CategoryResponseFix(category);
    } else {
      response = {
        name: "",
        editable: false,
        id: "",
      };
    }
    return response;
  }

  @Mutation((returns) => CategoryResponse)
  async UpdateCategory(
    @Args() { id, name }: UpdateCategory
  ): Promise<CategoryResponse> {
    let response: CategoryResponse;
    const existCategory = await CategoryModel.findById(id);
    if (existCategory && existCategory.editable === true) {
      const editable = existCategory.editable;
      await existCategory.CreateUpdateCategory({ name, editable });
      response = CategoryResponseFix(existCategory);
    } else {
      response = {
        name: "",
        editable: true,
        id: "",
      };
    }
    return response;
  }

  @Mutation((returns) => Boolean)
  async DeleteCategory(@Arg("id") id: string): Promise<Boolean> {
    let response: boolean = false;
    const existCategory = await CategoryModel.findById(id);
    if (existCategory && existCategory.editable === true) {
      await existCategory.DeleteCategory();
      response = true;
    }
    return response;
  }

  @Mutation((returns) => Boolean)
  async wz8_AddCategoryMain(): Promise<Boolean> {
    try {
      let category = new CategoryModel();
      const name = categoryMain;
      const existCategory = await CategoryModel.findOne({ name });
      if (!existCategory) {
        const editable = false;
        await category.CreateUpdateCategory({ name, editable });
      }
      return true;
    } catch (error) {
      return false;
    }
  }
}
