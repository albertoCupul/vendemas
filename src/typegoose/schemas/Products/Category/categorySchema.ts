import {getModelForClass, prop, Ref, modelOptions, QueryMethod, DocumentType} from '@typegoose/typegoose'
import {ObjectType, Field, ArgsType, Float} from 'type-graphql'

@ObjectType()
@modelOptions({ schemaOptions: { collection: 'Products.Category' } })
export class CategoryBase{
	@Field({description: 'Requerido'})
	@prop({required: true, unique: true})
	public name: string
	
	@Field({description: 'Requerido'})
	@prop({required:true, default:true})
	public editable: boolean
}


@ArgsType()
export class InputCategory implements Partial<CategoryBase> {
	@Field({description: 'Requerido'})
	public name: string
}

@ArgsType()
export class UpdateCategory extends InputCategory{
	@Field({description:'Requerido'})
	public id: string
}

@ObjectType()
export class CategoryMain extends CategoryBase{
	
	public async CreateUpdateCategory (this: DocumentType<CategoryMain>, data: {name:string, editable: boolean}){
		this.name = data.name
		this.editable = data.editable
		await this.save()
	}
	
	public async DeleteCategory (this: DocumentType<CategoryMain>){
		this.deleteOne({_id : this._id})
	}
}

@ObjectType()
export class CategoryResponse extends CategoryBase{
	@Field()
	public id : string
}

export const CategoryModel = getModelForClass<typeof CategoryMain>(CategoryMain)

