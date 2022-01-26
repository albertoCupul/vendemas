import {getModelForClass, prop, Ref, modelOptions, QueryMethod, DocumentType} from '@typegoose/typegoose'
import {ObjectType, Field, ArgsType,ID} from 'type-graphql'

@ObjectType()
@modelOptions({ schemaOptions: { collection: 'User.Modules' } })
export class ModuleBase {
	@Field({description: 'Requerido'})
	@prop({type: String, required: true, unique: true}) 
	public name: string

}

@ArgsType()
export class InputModule implements Partial<ModuleBase>{
	
	@Field({description: 'Requerido'})	
	public name: string
}

@ArgsType()
export class UpdateModule extends ModuleBase{
	
	@Field()
	public id : string
}

@ObjectType()
export class ModuleMain extends ModuleBase{
	
	public async CreateNew(this:DocumentType<ModuleMain>, name:string){		
		this.name = name
		await this.save()
	}

	
}

@ObjectType()
export class ModuleResponse extends ModuleBase{
	@Field()
	public id: string
}

export const ModuleModel = getModelForClass(ModuleMain)


