import {getModelForClass, prop, Ref, modelOptions,DocumentType} from '@typegoose/typegoose'
import {ObjectType, Field, ArgsType} from 'type-graphql'
import {encryptPwd, generatePwd, defaulPwd, comparePwd} from '../../../modules/bcrypt/bcrypt'

@ObjectType()
@modelOptions({ schemaOptions: { collection: 'User.Access' } })
export class UserAccessBase{
	@Field({description: 'Requerido'})
	@prop({type: String, required: true})
	public user: string
	
	@Field({description: 'Requerido'})
	@prop({type:Boolean, required: true})
	public login: boolean
}

@ArgsType()
export class InputUserAccess implements Partial<UserAccessBase>{
	
	@Field()
	public user: string
	
	@Field()
	public pwd: string

}

@ArgsType()
export class UpdateUserAccess extends InputUserAccess{
	
	@Field()
	public id : string
}

@ObjectType()
export class UserAccess extends UserAccessBase{	
	
	@Field({description: 'Requerido'})
	@prop({type: String, required: true})
	public pwd: string
	
	public async CreateUserAccess (this: DocumentType<UserAccess>, user:string){
		let pwd: string = defaulPwd;
		pwd = await(encryptPwd(pwd))
		this.user = user
		this.pwd = pwd
		this.login = false
		await this.save()
	}
	public async UpdateAccess (this: DocumentType<UserAccess>, 
		data:{user:string, pwd:string}){
		
		const newPass = await encryptPwd(data.pwd)
		this.user = data.user
		this.pwd= newPass	
		await this.save()
	}
	
	public async UpdateLogin (this: DocumentType<UserAccess>, loginStatus: boolean){		
		this.login = loginStatus			
		await this.save()
	}

	public async DeleteUserAccess (this: DocumentType<UserAccess>){
		await this.deleteOne({_id:this._id})
	}
	
	public async LogInOut (this: DocumentType<UserAccess>, 
		data:{user:string, pwd:string, loginStatus:boolean}): Promise<string>{
		
		let response : string = null
		const AccessData = await UserAccessModel.findOne({user:data.user})
		const isSamePwd : boolean = await comparePwd(data.pwd, AccessData.pwd)
		if (isSamePwd){
			AccessData.UpdateLogin(data.loginStatus)

			response = AccessData._id.valueOf()
		}
		return response
		
	}

}

@ObjectType()
export class UsrAccResponse extends UserAccessBase{
	@Field()
	public id : string
}

@ArgsType()
export class Login {
	
	@Field()
	public user : string
	
	@Field()
	public pwd : string
}

export const UserAccessModel = getModelForClass(UserAccess)

