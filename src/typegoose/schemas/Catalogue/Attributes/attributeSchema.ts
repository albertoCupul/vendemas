import {getModelForClass, prop, Ref, modelOptions, QueryMethod, DocumentType} from '@typegoose/typegoose'
import {ObjectType, Field, ArgsType, Float} from 'type-graphql'

@ObjectType()
@modelOptions({ schemaOptions: { collection: 'Catalogue.Attribute' } })
export class AttributeBase{
	@Field({description: 'Requerido'})
	@prop({required: true, unique: true})
	public name: string
	
}


@ArgsType()
export class InputAttribute implements Partial<AttributeBase> {
	@Field({description: 'Requerido'})
	public name: string

}

@ArgsType()
export class UpdateAttribute extends InputAttribute{
	@Field({description:'Requerido'})
	public id: string
}

@ObjectType()
export class AttributeMain extends AttributeBase{
	
	public async CreateUpdateAttribute (this: DocumentType<AttributeMain>, name:string){
		this.name = name
		await this.save()
	}
	
	public async DeleteAttribute (this: DocumentType<AttributeMain>){
		this.deleteOne({_id : this._id})
	}
}

@ObjectType()
export class AttributeResponse extends AttributeBase{
	@Field()
	public id : string
}

export const AttributeModel = getModelForClass<typeof AttributeMain>(AttributeMain)

