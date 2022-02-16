import {getModelForClass, prop, Ref, modelOptions, QueryMethod, DocumentType} from '@typegoose/typegoose'
import {ObjectType, Field, ArgsType, Float} from 'type-graphql'

@ObjectType()
@modelOptions({ schemaOptions: { collection: 'Products.Complement' } })
export class ComplementBase{
	@Field({description: 'Requerido'})
	@prop({required: true, unique: true})
	public name: string
	
	@Field({description: 'Requerido'})
	@prop({required:true, default:true})
	public precio: number
}


@ArgsType()
export class InputComplement implements Partial<ComplementBase> {
	@Field({description: 'Requerido'})
	public name: string

	@Field({description: 'Requerido'})
	@prop({required:true, default:true})
	public precio: number
}

@ArgsType()
export class UpdateComplement extends InputComplement{
	@Field({description:'Requerido'})
	public id: string
}

@ObjectType()
export class ComplementMain extends ComplementBase{
	
	@Field({description:'Requerido'})
	public _id: string

	public async CreateUpdateComplement (this: DocumentType<ComplementMain>, data: {name:string, precio: number}){
		this.name = data.name
		this.precio = data.precio
		await this.save()
	}
	
	public async DeleteComplement (this: DocumentType<ComplementMain>){
		this.deleteOne({_id : this._id})
	}
}

@ObjectType()
export class ComplementResponse extends ComplementBase{
	@Field()
	public id : string
}

export const ComplementModel = getModelForClass<typeof ComplementMain>(ComplementMain)

