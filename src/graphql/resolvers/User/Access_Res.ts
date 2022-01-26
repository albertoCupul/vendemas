import {Resolver, Query, Mutation, Arg, Args, Int } from 'type-graphql'
import { DocumentType } from "@typegoose/typegoose";

import {ObjectId} from 'mongoose'

import {UserAccessModel, 
        UserAccess, 
        InputUserAccess, 
        UpdateUserAccess, 
        Login, 
        UsrAccResponse} from '../../../typegoose/schemas/User/usrAccSchema'

import {UserModel, UserResponse} from '../../../typegoose/schemas/User/userSchema'

import {accessResponseFix, UserResponseFix, existUser} from '../../../typegoose/schemas/User/middleware'

@Resolver(UserAccess)
export class UsrAccResolver{
  
  @Mutation( returns => UsrAccResponse)
  async UpdateUserAccess (@Args() {user, pwd, id} : UpdateUserAccess) : Promise<UsrAccResponse>{
    const existUserName = await existUser(user, id)
    let response : UsrAccResponse
    if (!existUserName){
      let access = await UserAccessModel.findById(id).orFail().exec()
      await access.UpdateAccess({user, pwd})    
      response = accessResponseFix(access)      
    }else {
      response = {
        user : "",
        login : false,
        id : ""
        }
    }
    return response
  }
  
  @Mutation(returns => UserResponse)
  async LoginUser (@Args () {user, pwd} : Login) : Promise<UserResponse>{
      let response : string = null
      let DataResponse : UserResponse
      const dataUser = new UserAccessModel()
      const loginStatus:boolean = true
      response = await dataUser.LogInOut({user, pwd, loginStatus})
      if (response!==null){
          const UserData = await UserModel.find().findByRef(response)
          DataResponse = UserResponseFix(UserData)
      }
      return DataResponse
  }
  
  @Mutation(returns => UserResponse)
  async LogoutUser (@Args () {user, pwd} : Login) : Promise<UserResponse>{
      let response : string = null
      let DataResponse : UserResponse
      const dataUser = new UserAccessModel()
      const loginStatus:boolean = false
      response = await dataUser.LogInOut({user, pwd, loginStatus})
      if (response!==null){
          const UserData = await UserModel.find().findByRef(response)
          DataResponse = UserResponseFix(UserData)
      }
      return DataResponse
  }
    
}
