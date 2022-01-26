import {getModelForClass, prop, Ref, modelOptions, QueryMethod, DocumentType} from '@typegoose/typegoose'
import {ObjectType, Field, ArgsType, ID} from 'type-graphql'
import {Types} from 'mongoose'

import { findByNamePopulate, findByRef, QueryHelpers } from './QueryHelpers/RuleQueryHelper'
import {LiteralMain, LiteralModel, LiteralResult} from './LiteralSchema'

@ObjectType()
@modelOptions({ schemaOptions: { collection: 'Rules.Main' } })
export class RuleBase{
	
	@Field({description: 'Requerido'})
	@prop({required: true, unique: true})
	public name: string
	
	@Field(type => [String])
	@prop({type: [String], required: true})
	public arrayOperators: Array<string>
	
}

@ArgsType()
export class InputRule implements Partial<RuleBase> {
	@Field({description: 'Requerido'})
	public name: string
	
	@Field(type => [String], {description: 'Requerido'})
	public literal: string[]
	
	@Field(type => [String])
	public arrayOperators: Array<string>
	
}

@ArgsType()
export class UpdateRule extends InputRule{
	@Field({description:'Requerido'})
	public id: string
}

@ObjectType()
@QueryMethod(findByNamePopulate)
@QueryMethod(findByRef)
//@QueryMethod(findById)
export class RuleMain extends RuleBase{
	
	@Field(type => String)
	@prop({ref:() => LiteralMain}) 
	public idLiteral: Ref<LiteralMain>[]
	
	
	public async CreateUpdateRule (this: DocumentType<RuleMain>, data: {name:string, 
		literal:Array<string>, arrayOperators:Array<string>}){
		const literal = await LiteralModel.findById(data.literal)
		this.name = data.name	
		data.literal.forEach((element) => {
			this.idLiteral.push(new Types.ObjectId(element))
		})
		this.arrayOperators = data.arrayOperators
		await this.save()
	}
	
	public async DeleteLiteral (this: DocumentType<RuleMain>){
		this.deleteOne({_id : this._id})
	}
}

@ObjectType()
export class RuleResponse extends RuleBase{
	
	@Field({description:'Campo _id'})
	public id:string
	
	@Field(type => [LiteralResult], { nullable: true })
	public objectLiterals?: LiteralResult[]
}

export const RuleModel = getModelForClass<typeof RuleMain, QueryHelpers>(RuleMain)

