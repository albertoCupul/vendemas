import { Resolver, Query, Mutation, Arg, Args, Int } from "type-graphql";
import { DocumentType } from "@typegoose/typegoose";

import { listPerfil } from "../../../DefaultSettings/defaultValues";

import {
  PerfilMain,
  InputPerfil,
  UpdatePerfil,
  PerfilResponse,
  PerfilModel,
} from "../../../typegoose/schemas/User/userPerfilSchema";

import {
  ModuleModel,
  ModuleMain,
} from "../../../typegoose/schemas/User/userModules";

import {
  perfilResponseFix,
  perfilArrayResponseFix,
  existInDBPerfil,
  modelExistInRule,
} from "../../../typegoose/schemas/User/middleware";

@Resolver(UserPerfilResolver)
export class UserPerfilResolver {
  @Query((returns) => PerfilResponse)
  async QueryPerfilById(@Arg("id") id: string): Promise<PerfilResponse> {
    const perfilData = await PerfilModel.findById(id)
      .populate("idModules")
      .orFail()
      .exec();
    const response = perfilResponseFix(perfilData);
    return response;
  }

  @Query((returns) => [PerfilResponse])
  async QueryPerfilList(): Promise<PerfilResponse[]> {
    const perfilData: Array<PerfilMain> = await PerfilModel.find({})
      .populate("idModules")
      .orFail()
      .exec();
    const response: Array<PerfilResponse> = perfilArrayResponseFix(perfilData);
    return response;
  }

  @Query((returns) => Boolean)
  async QueryModuleInPerfil(
    @Arg("idPerfil") idPerfil: string,
    @Arg("idModule") idModule: string
  ): Promise<Boolean> {
    const response: boolean = await modelExistInRule(idPerfil, idModule);
    return response;
  }

  @Mutation(returns => Boolean)
  async wz2_createPerfilUserList():Promise<Boolean>{
    try {
      listPerfil.perfil.forEach(async (elemento) => {
        const namePerfil = elemento.name;
        const modelos = elemento.modules.map(async (modulo) => {
          const module =  await ModuleModel.findOne({ name: modulo }).exec();
          return module;
        })      
        await Promise.all(modelos).then((arrayModelos) => {        
          //const alreadyExist: boolean = await existInDBPerfil(namePerfil);
          //if (!alreadyExist) {
            let perfil = new PerfilModel();
            perfil.CreateNew({ namePerfil, arrayModelos });
            console.log('creando');
            
          //}
        });
      });
      return true;
    } catch (error) {    
      return false;
    }
  }

}
