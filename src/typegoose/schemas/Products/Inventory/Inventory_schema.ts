import {getModelForClass, prop, Ref, modelOptions, QueryMethod, DocumentType} from '@typegoose/typegoose'
import {ObjectType, Field, ArgsType, Float} from 'type-graphql'

@ObjectType()
@modelOptions({ schemaOptions: { collection: 'Products.Inventory' } })
export class InventoryBase{
	
	@Field({description: 'Requerido'})
	@prop({required:true, default:false})
	public manage: boolean

	@Field({description: 'Requerido'})
	@prop({required:true})
	public min: number

	@Field({description: 'Requerido'})
	@prop({required:true})
	public quantity: number

	@Field({description: 'Requerido'})
	@prop({required:true})
	public width: number

	@Field({description: 'Requerido'})
	@prop({required:true})
	public heigth: number
	
}


@ArgsType()
export class InputInventory implements Partial<InventoryBase> {
	@Field({description: 'Requerido'})
	public manage: boolean

	@Field({description: 'Requerido'})
	public min: number

	@Field({description: 'Requerido'})
	public quantity: number

	@Field({description: 'Requerido'})
	public width: number

	@Field({description: 'Requerido'})
	public heigth: number
}

@ArgsType()
export class UpdateInventory extends InputInventory{
	@Field({description:'Requerido'})
	public id: string
}

@ObjectType()
export class InventoryMain extends InventoryBase{	
	
	@Field({description:'Requerido'})
	public _id: string

	public async CreateUpdateInventory (this: DocumentType<InventoryMain>, data:InputInventory){
		this.manage = data.manage
		this.min = data.min
		this.quantity = data.quantity
		this.width = data.width
		this.heigth = data.heigth
		await this.save()
	}
	
	public async DeleteInventory (this: DocumentType<InventoryMain>){
		this.deleteOne({_id : this._id})
	}
}

@ObjectType()
export class InventoryResponse extends InventoryBase{
	@Field()
	public id : string

}

export const InventoryModel = getModelForClass<typeof InventoryMain>(InventoryMain)

