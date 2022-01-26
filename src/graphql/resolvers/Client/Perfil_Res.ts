import {Resolver, Query, Mutation, Arg, Args, Int } from 'type-graphql'
import { DocumentType } from "@typegoose/typegoose";

import {ObjectId} from 'mongoose'

import {PerfilModel, InputClientPerfil, UpdateClientPerfil, ClientPerfilResponse} from '../../../typegoose/schemas/Client/clPerfilSchema'
import {RuleModel}  from '../../../typegoose/schemas/Rules/RuleSchema'
import {PerfilResponseFix} from '../../../typegoose/schemas/Client/middleware'
import {ClienteGeneralPerfil} from '../../../DefaultSettings/defaultValues'

@Resolver(ClientPerfilResolver)
export class ClientPerfilResolver{
  
  @Query(returns => ClientPerfilResponse)
  async QueryClientPerfil (@Arg('id') id:string) : Promise<ClientPerfilResponse>{
    let response : ClientPerfilResponse
    const perfil = await PerfilModel.findById(id).populate('idRule')    
    response = PerfilResponseFix(perfil)    
    return response
  }
  
  @Mutation(type => ClientPerfilResponse)
  async AddClientPerfil (@Args() {name, ruleID} : InputClientPerfil) : Promise<ClientPerfilResponse>{
    let response : ClientPerfilResponse
    let perfil = new PerfilModel()
    let rule = await RuleModel.findById(ruleID)
    if (rule){     
      await perfil.CreateAndUpdate({name, rule})
      perfil = await PerfilModel.findById(perfil._id.valueOf()).populate('idRule')      
      response = PerfilResponseFix(perfil)
    }
  return response
  }
  
  @Mutation(type => ClientPerfilResponse)
  async UpdateClientPerfil (@Args() {name, ruleID, id} : UpdateClientPerfil) : Promise<ClientPerfilResponse>{
    let response : ClientPerfilResponse
    const rule = await RuleModel.findById(ruleID)
    let perfil = await PerfilModel.findById(id)
    if (rule && perfil){
      await perfil.CreateAndUpdate({name, rule})
      perfil = await PerfilModel.findById(perfil._id.valueOf()).populate('idRule')
      response = PerfilResponseFix(perfil)
    }
    return response
  }
  
  @Mutation(type => Boolean)
  async DeleteClientPerfil (@Arg('id') id : string) : Promise<Boolean>{
    let response : boolean = false
    let perfil = await PerfilModel.findById(id)
    if (perfil){
      if (perfil.name !== ClienteGeneralPerfil.name){
        perfil.DeleteIt()
        response = true        
      }
    }
    return response
  }
  
  @Mutation(type => Boolean)
  async AddClientGeneralPerfil () : Promise<Boolean>{
    const name = ClienteGeneralPerfil.name
    const rule = await RuleModel.findOne({name:ClienteGeneralPerfil.ruleName})
    let response : boolean = false
    if (rule){
      const perfil = new PerfilModel()
      await perfil.CreateAndUpdate({name, rule})
      response = true
    }
    return response  
  }
  
}
