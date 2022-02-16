/* Aqui se declaran los resolvers (query and mutations) del servidor */
import { Resolver, Query, Mutation, Arg, Args, Int } from "type-graphql";

import {
  SellUnityModel,
  SellUnityMain,
  SellUnityResponse,
  InputSellUnity,
  UpdateSellUnity,
} from "../../../../typegoose/schemas/Products/SellUnity/SellUnity_schema";

import {
  SellUnityResponseFix,
  SellUnityArrayResponseFix,
} from "../../../../typegoose/schemas/Products/SellUnity/middleware";

import {DefaultSellUnity} from "../../../../DefaultSettings/defaultValues"


@Resolver(SellUnityMain)
export class SellUnityResolver {
  @Query((returns) => [SellUnityResponse])
  async QuerySellUnityByName(
    @Arg("name") name: string
  ): Promise<SellUnityResponse[]> {
    const SellUnity = await SellUnityModel.find({
      name: { $regex: name, $options: "i" },
    });

    const response: Array<SellUnityResponse> =
      SellUnityArrayResponseFix(SellUnity);
    return response;
  }

  @Query((returns) => SellUnityResponse)
  async QuerySellUnityById(@Arg("id") id: string): Promise<SellUnityResponse> {
    const SellUnity = await SellUnityModel.findById(id);
    const response: SellUnityResponse = SellUnityResponseFix(SellUnity);
    return response;
  }

  @Mutation((returns) => SellUnityResponse)
  async AddSellUnity(
    @Args() {name, SATKey}: InputSellUnity
  ): Promise<SellUnityResponse> {
    let SellUnity = new SellUnityModel();
    let response: SellUnityResponse;
    const existSellUnity = await SellUnityModel.findOne({ name });
    if (!existSellUnity) {      
      await SellUnity.CreateUpdateSellUnity({ name, SATKey });
      SellUnity = await SellUnityModel.findById(SellUnity._id.valueOf());
      response = SellUnityResponseFix(SellUnity);
    } else {
      response = {
        name: "",
        SATKey: "",
        id: "",
      };
    }
    return response;
  }

  @Mutation((returns) => SellUnityResponse)
  async UpdateSellUnity(
    @Args() {name, SATKey, id}: UpdateSellUnity
  ): Promise<SellUnityResponse> {
    let response: SellUnityResponse;
    const existOtherUnityName = await SellUnityModel.findOne({_id:{$ne:id}, name})
    let existSellUnity = await SellUnityModel.findById(id)
    if (existSellUnity && !existOtherUnityName) {      
      await existSellUnity.CreateUpdateSellUnity({ name, SATKey });
      existSellUnity = await SellUnityModel.findById(existSellUnity._id.valueOf());
      response = SellUnityResponseFix(existSellUnity);
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
  async DeleteSellUnity(
    @Arg('id') id: string
  ): Promise<Boolean> {
    let response: boolean = false;
    const existUnity = await SellUnityModel.findById(id);
    if (existUnity) {
        await existUnity.DeleteSellUnity();
        response = true;
    }
    return response;
  }
  
  @Mutation(returns => Boolean)
  async wz9_addSellUnityDefault() : Promise<Boolean>{  
    try{
      DefaultSellUnity.forEach(async data =>{      
        const SellUnity = new SellUnityModel()
        const existOtherUnityName = await SellUnityModel.findOne({name: data.name})
        if (!existOtherUnityName){
          const name = data.name
          const SATKey = data.SATKey
          await SellUnity.CreateUpdateSellUnity({ name, SATKey });        
        }
      })
      return true
    } catch (error){
      return false
    }
  }
}
