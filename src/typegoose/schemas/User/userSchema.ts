/* Aqui se definen los esquemas de typegoose mesclados con los typescript para evitar duplicidad*/

import {getModelForClass, prop, Ref, modelOptions, QueryMethod, DocumentType} from '@typegoose/typegoose'
import {ObjectType, Field, ArgsType,ID} from 'type-graphql'

import {UserAccess, UserAccessModel, UsrAccResponse} from './usrAccSchema'
import {PerfilModel, PerfilMain, PerfilResponse} from './userPerfilSchema'
import {findByName, QueryHelpers, findByRef} from './QueryHelper/UserQueryHelpers'


@ObjectType()
@modelOptions({ schemaOptions: { collection: 'User.Main' } })
export class UserMainBase {
	@Field({description: 'Requerido'})
	@prop({type: String, required: true}) 
	public name: string
	
	@Field({description: 'Requerido'})
	@prop({type: String, required: true}) 
	public first: string
	
	@Field({description: 'Puede ser cadena vacía'})
	@prop({type: String}) 
	public second?: string
	
	@Field({description: 'Requerido'})
	@prop({type:String, required: true, index: true})
	public fullName: string
	
	@Field({description: 'Puede ser cadena vacía'})
	@prop({type: String}) 
	public phone?: string
	
	@Field()
	@prop({type: Date, required: true}) 
	public registerDate: Date

}


@ArgsType()
export class InputUserName implements Partial<UserMain>{
	
	@Field()
	public name: string
	
	@Field()
	public first: string
	
	@Field()
	public second?: string
	
	@Field()
	public phone?: string
	
	@Field()
	public PerfilID : string
}

@ArgsType()
export class UpdateUserName extends InputUserName{
	@Field({description: 'Requerido'})
	public id: string	
}

@ObjectType()
/*Se asignan los métodos de consulta QueryHelpers al tipo de documento UserMain*/
@QueryMethod(findByName)
@QueryMethod(findByRef)
export class UserMain extends UserMainBase{
	
	@Field(type =>ID)
	@prop({ref:() => UserAccess}) 
	public idAccess: Ref<UserAccess>
	
	@Field(type =>ID)
	@prop({ref:() => PerfilMain}) 
	public idPerfil: Ref<PerfilMain>
	
	@Field()
	public _id : string
	
	/* Aqui se definen los métodos del documento UserMain */
	public async CreateUser (this: DocumentType<UserMain>, data:{name:string, first:string, second:string, phone:string, perfil:PerfilMain}){
		const NewAccess = new UserAccessModel()
		const arrayName: string[] = data.name.split(' ')		
		let user: string = ""
		let randomNumber = new Date().getTime()
		if (data.first !== "") user = arrayName[0]+'.'+data.first+'.'+randomNumber.toString()
		else user = arrayName[0]
		await NewAccess.CreateUserAccess(user.toLowerCase())

		this.name = data.name
		this.first = data.first
		this.second = data.second
		this.fullName = data.name + ' ' + data.first + ' ' + data.second
		this.phone = data.phone
		this.registerDate = new Date(Date.now())
		this.idAccess = NewAccess._id
		this.idPerfil = data.perfil
		await this.save()
	}	
	public async UpdateUserMain (this: DocumentType<UserMain>, data:{name:string, first:string, second:string, phone:string}){
		this.name = data.name
		this.first= data.first
		this.second = data.second
		this.phone = data.phone
		this.fullName = data.name + ' ' + data.first + ' ' + data.second
		await this.save()
	}

	public async DeleteUser (this: DocumentType<UserMain>){
		const access = await UserAccessModel.findById(this.idAccess)
		await access.DeleteUserAccess()
		await this.deleteOne({_id:this._id})
	}	
	
	public async CreateUserAdmin (this: DocumentType<UserMain>, data:{name:string, first:string, second:string, phone:string, perfil:PerfilMain}){
		const NewAccess = new UserAccessModel()		
		await NewAccess.CreateUserAccess("admin")

		this.name = data.name
		this.first = data.first
		this.second = data.second
		this.fullName = data.name + ' ' + data.first
		this.phone = data.phone
		this.registerDate = new Date(Date.now())
		this.idAccess = NewAccess._id
		this.idPerfil = data.perfil
		await this.save()
	}

}

@ObjectType()
export class UserResponse extends UserMainBase{
	
	@Field()
	public id: string
	
	@Field(type => UsrAccResponse)
	public objectAccess?: UsrAccResponse
	
	@Field(type => PerfilResponse)
	public objectPerfil?: PerfilResponse
}

export const UserModel = getModelForClass<typeof UserMain, QueryHelpers>(UserMain)

