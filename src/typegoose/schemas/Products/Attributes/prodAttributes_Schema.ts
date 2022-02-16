import {getModelForClass, prop, Ref, modelOptions, QueryMethod, DocumentType} from '@typegoose/typegoose'
import {ObjectType, Field, ArgsType, Float} from 'type-graphql'
import {AttributeMain} from "../../Catalogue/Attributes/attributeSchema"

@ObjectType()
@modelOptions({ schemaOptions: { collection: 'Products.Attributes' } })
export class ProdAttrBase{
	
	@Field({description: 'Requerido'})
	@prop({required:true, default:true})
	public value: string
}


@ArgsType()
export class InputProdAttr implements Partial<ProdAttrBase> {
	@Field({description: 'Requerido'})
	public attributeId: string

	@Field({description: 'Requerido'})
	public value: string
}

@ArgsType()
export class UpdateProdAttr extends InputProdAttr{
	@Field({description:'Requerido'})
	public id: string
}

@ObjectType()
export class ProdAttrMain extends ProdAttrBase{
	
	@Field({description:'Requerido'})
	public _id: string

	@Field(type => AttributeMain)
	@prop({ref:() => AttributeMain})
	public attributeId: string
	
	public async CreateUpdateProdAttr (this: DocumentType<ProdAttrMain>, data: {attributeId:string, value: string}){		 

		this.attributeId = data.attributeId
		this.value = data.value
		await this.save()
	}
	
	public async DeleteProdAttr (this: DocumentType<ProdAttrMain>){
		this.deleteOne({_id : this._id})
	}
}

@ObjectType()
export class ProdAttrResponse extends ProdAttrBase{
	@Field()
	public id : string

	@Field({ nullable: true })
	public attributeId?: AttributeMain
}

export const ProdAttrModel = getModelForClass<typeof ProdAttrMain>(ProdAttrMain)

