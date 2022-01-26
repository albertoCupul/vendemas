import {getModelForClass, prop, Ref, modelOptions, QueryMethod, DocumentType} from '@typegoose/typegoose'
import {ObjectType, Field, ArgsType,ID} from 'type-graphql'

import {ModuleMain, ModuleResponse} from './userModules'
import { findByRef, QueryHelpers } from './QueryHelper/PerfilQueryHelpers'

@ObjectType()
@modelOptions({ schemaOptions: { collection: 'User.Perfil' } })
export class PerfilBase {
	@Field({description: 'Requerido'})
	@prop({type: String, required: true, unique: true}) 
	public name: string

}

@ArgsType()
export class InputPerfil implements Partial<PerfilBase>{
	
	@Field({description: 'Requerido'})	
	public name: string
}

@ArgsType()
export class UpdatePerfil extends PerfilBase{
	@Field()
	public id : string
}

@ObjectType()
@QueryMethod(findByRef)
export class PerfilMain extends PerfilBase{
	
	@Field(type => ID)
	@prop({ref:() => ModuleMain})
	public idModules: Ref<ModuleMain>[]
	
	public async CreateNew(this:DocumentType<PerfilMain>, data:{namePerfil:string, arrayModelos:Array<ModuleMain>}){		
		this.name = data.namePerfil
		this.idModules = data.arrayModelos
		await this.save()
	}

	
}

@ObjectType()
export class PerfilResponse extends PerfilBase{
	
	@Field()
	public id: string
	
	@Field( type => [ModuleResponse], {nullable:true})
	public objectModules? : Array<ModuleResponse>
}

export const PerfilModel = getModelForClass<typeof PerfilMain, QueryHelpers>(PerfilMain)


