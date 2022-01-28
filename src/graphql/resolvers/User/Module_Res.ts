import { Resolver, Query, Mutation, Arg, Args, Int } from "type-graphql";
import { DocumentType } from "@typegoose/typegoose";

import { deleteCollections } from "../../../mongoose/deleteCollections";

import { listModules } from "../../../DefaultSettings/defaultValues";

import {
  ModuleMain,
  InputModule,
  UpdateModule,
  ModuleResponse,
  ModuleModel,
} from "../../../typegoose/schemas/User/userModules";

import {
  moduleResponseFix,
  moduleArrayResponseFix,
  existInDB,
} from "../../../typegoose/schemas/User/middleware";

@Resolver(UserModulesResolver)
export class UserModulesResolver {
  @Query((returns) => ModuleResponse)
  async QueryModuleById(@Arg("id") id: string): Promise<ModuleResponse> {
    const moduleData = await ModuleModel.findById(id).orFail().exec();
    const response = moduleResponseFix(moduleData);
    return response;
  }

  @Query((returns) => [ModuleResponse])
  async QueryModuleList(): Promise<ModuleResponse[]> {
    const moduleData: Array<ModuleMain> = await ModuleModel.find({})
      .orFail()
      .exec();
    const response: Array<ModuleResponse> = moduleArrayResponseFix(moduleData);
    return response;
  }

  @Mutation((returns) => ModuleResponse)
  async AddModule(@Args() { name }: InputModule): Promise<ModuleResponse> {
    try {
      const alreadyExist: boolean = await existInDB(name);
      let response: ModuleResponse;
      if (!alreadyExist) {
        let module = new ModuleModel();
        await module.CreateNew(name);
        module = await ModuleModel.findById(module._id.valueOf())
          .orFail()
          .exec();
        response = moduleResponseFix(module);
      } else {
        response = {
          name: "",
          id: "",
        };
      }

      return response;
    } catch (error) {
      return error;
    }
  }

  @Mutation(returns => Boolean)
  async wz1_createModulesList () : Promise<Boolean>{
    try {
      await deleteCollections()
      listModules.forEach(async elemento => {
        let module = new ModuleModel();
        await module.CreateNew(elemento);
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
