/* Aqui se declaran los resolvers (query and mutations) del servidor */
import {Resolver, Query, Mutation, Arg, Args, Int } from 'type-graphql'
import { DocumentType } from "@typegoose/typegoose";

import {UserModel, 
        UserMain, 
        InputUserName, 
        UpdateUserName, 
        UserResponse} from '../../../typegoose/schemas/User/userSchema'
        
import {PerfilModel} from '../../../typegoose/schemas/User/userPerfilSchema'

import {UserResponseFix, UserArrayResponseFix} from '../../../typegoose/schemas/User/middleware'


@Resolver(UserMain)
export class UserResolver{
    @Query(returns => [UserResponse])
    async QueryUserByName (@Arg('name') name:string) : Promise<UserResponse[]> {
        const user:DocumentType<UserMain>[] = await UserModel.find().findByName(name).orFail().exec()
        const response : Array<UserResponse> = UserArrayResponseFix(user)
        return response
    }

    @Query(returns => UserResponse)
    async QueryUserById (@Arg('id') id:string) : Promise<UserResponse> {
        const user =await UserModel.findById(id).populate('idAccess').exec()        
        const response : UserResponse = UserResponseFix(user)
        return response
    }

    @Mutation(returns => UserResponse)
    async AddUser (@Args() {name, first, second, phone, PerfilID}: InputUserName): Promise<UserResponse>{   
        let user = new UserModel()
        let response : UserResponse
        const perfil = await PerfilModel.findById(PerfilID)
        if (perfil){
            await user.CreateUser({name, first, second, phone, perfil})  
            user  = await UserModel.findById(user._id.valueOf()).populate('idAccess').populate('idPerfil').exec()    
            response = UserResponseFix(user)
        }
        return response
    }
    
    @Mutation(returns => UserResponse)
    async AddUserAdmin (): Promise<UserResponse>{   
        let response : UserResponse
        let user = new UserModel()
        const name = "Administrador"
        const first = "Administrador"
        const second = ""
        const phone = ""
        const perfil = await PerfilModel.findOne({name : 'Administrador'})
        if (perfil){
            await user.CreateUserAdmin({name, first, second, phone, perfil})  
            user  = await UserModel.findById(user._id.valueOf()).populate('idAccess').populate('idPerfil').exec()           
            response = UserResponseFix(user)
        }
        return response
    }

    @Mutation(returns => UserResponse)
    async UpdateUserMain (@Args() {id, name, first, second, phone}: UpdateUserName): Promise<UserResponse>{     
        let user =await UserModel.findById(id).exec()
        await user.UpdateUserMain({name, first, second, phone})  
        user  = await UserModel.findById(user._id.valueOf()).orFail().exec()    
        const response : UserResponse = UserResponseFix(user)
        return response
    }

    @Mutation(returns => Boolean)
    async DeleteUser (@Arg('id') id:string): Promise<Boolean>{
        const user = await UserModel.findById(id)
        let response : boolean = false
        if (user !== null){            
            await user.DeleteUser()  
            response = true      
        }
        return response
    }    
    
}

