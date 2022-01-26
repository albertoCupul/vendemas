import {getModelForClass, prop, Ref, modelOptions, QueryMethod, DocumentType} from '@typegoose/typegoose'
import {ObjectType, Field, ArgsType, Float} from 'type-graphql'

import { findByName, QueryHelpers } from './QueryHelpers/QueryHelper'

@ObjectType()
@modelOptions({ schemaOptions: { collection: 'Rules.Literals' } })
export class LiteralBase{
	@Field({description: 'Requerido'})
	@prop({required: true, unique: true})
	public name: string
	
	@Field(type => Float, {description: 'Requerido'})
	@prop({required: true})
	public value: number
	
	@Field({description: 'Requerido'})
	@prop({required:true, default:true})
	public editable: boolean
}


@ArgsType()
export class InputLiteral implements Partial<LiteralBase> {
	@Field({description: 'Requerido'})
	public name: string
	
	@Field(type => Float, {description: 'Requerido'})
	public value: number
	
	@Field({description: 'Requerido'})
	public editable: boolean
}

@ArgsType()
export class UpdateLiteral extends InputLiteral{
	@Field({description:'Requerido'})
	public id: string
}

@ObjectType()
@QueryMethod(findByName)
export class LiteralMain extends LiteralBase{
	
	public async CreateUpdateLiteral (this: DocumentType<LiteralMain>, data: {name:string, value:number, editable: boolean}){
		this.name = data.name
		this.value = data.value
		this.editable = data.editable
		await this.save()
	}
	
	public async DeleteLiteral (this: DocumentType<LiteralMain>){
		this.deleteOne({_id : this._id})
	}
}

@ObjectType()
export class LiteralResult extends LiteralBase{
	@Field()
	public id : string
}

export const LiteralModel = getModelForClass<typeof LiteralMain, QueryHelpers>(LiteralMain)

