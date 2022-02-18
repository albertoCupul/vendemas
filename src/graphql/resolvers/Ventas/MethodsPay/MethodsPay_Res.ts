/* Aqui se declaran los resolvers (query and mutations) del servidor */
import { Resolver, Query, Mutation, Arg, Args, Int } from "type-graphql";

import {
  MethodsPayModel,
  MethodsPayMain,
  MethodsPayResponse,
  InputMethodsPay,
  UpdateMethodsPay,
} from "../../../../typegoose/schemas/Ventas/MethodsPay/MethodsPay_schema";

import {
  MethodsPayResponseFix,
  MethodsPayArrayResponseFix,
} from "../../../../typegoose/schemas/Ventas/MethodsPay/middleware";

import {DefaultMethodsPay} from "../../../../DefaultSettings/defaultValues"


@Resolver(MethodsPayMain)
export class MethodsPayResolver {
  @Query((returns) => [MethodsPayResponse])
  async QueryMethodsPayByName(
    @Arg("name") name: string
  ): Promise<MethodsPayResponse[]> {
    const MethodsPay = await MethodsPayModel.find({
      name: { $regex: name, $options: "i" },
    });

    const response: Array<MethodsPayResponse> =
      MethodsPayArrayResponseFix(MethodsPay);
    return response;
  }

  @Query((returns) => MethodsPayResponse)
  async QueryMethodsPayById(@Arg("id") id: string): Promise<MethodsPayResponse> {
    const MethodsPay = await MethodsPayModel.findById(id);
    const response: MethodsPayResponse = MethodsPayResponseFix(MethodsPay);
    return response;
  }

  @Mutation((returns) => MethodsPayResponse)
  async AddMethodsPay(
    @Args() {name, SATKey}: InputMethodsPay
  ): Promise<MethodsPayResponse> {
    let MethodsPay = new MethodsPayModel();
    let response: MethodsPayResponse;
    const existMethodsPay = await MethodsPayModel.findOne({ name });
    if (!existMethodsPay) {      
      await MethodsPay.CreateUpdateMethodsPay({ name, SATKey });
      MethodsPay = await MethodsPayModel.findById(MethodsPay._id.valueOf());
      response = MethodsPayResponseFix(MethodsPay);
    } else {
      response = {
        name: "",
        SATKey: "",
        id: "",
      };
    }
    return response;
  }

  @Mutation((returns) => MethodsPayResponse)
  async UpdateMethodsPay(
    @Args() {name, SATKey, id}: UpdateMethodsPay
  ): Promise<MethodsPayResponse> {
    let response: MethodsPayResponse;
    const existOtherUnityName = await MethodsPayModel.findOne({_id:{$ne:id}, name})
    let existMethodsPay = await MethodsPayModel.findById(id)
    if (existMethodsPay && !existOtherUnityName) {      
      await existMethodsPay.CreateUpdateMethodsPay({ name, SATKey });
      existMethodsPay = await MethodsPayModel.findById(existMethodsPay._id.valueOf());
      response = MethodsPayResponseFix(existMethodsPay);
    } else {
      response = {
        name: "",
        SATKey: "",
        id: "",
      };
    }
    return response;
  }

  @Mutation((returns) => Boolean)
  async DeleteMethodsPay(
    @Arg('id') id: string
  ): Promise<Boolean> {
    let response: boolean = false;
    const existUnity = await MethodsPayModel.findById(id);
    if (existUnity) {
        await existUnity.DeleteMethodsPay();
        response = true;
    }
    return response;
  }
  
  @Mutation(returns => Boolean)
  async wz9_addMethodsPayDefault() : Promise<Boolean>{  
    try{
      DefaultMethodsPay.forEach(async data =>{      
        const MethodsPay = new MethodsPayModel()
        const existOtherUnityName = await MethodsPayModel.findOne({name: data.name})
        if (!existOtherUnityName){
          const name = data.name
          const SATKey = data.SATKey
          await MethodsPay.CreateUpdateMethodsPay({ name, SATKey });        
        }
      })
      return true
    } catch (error){
      return false
    }
  }
}
