import {getModelForClass, prop, Ref, modelOptions, QueryMethod, DocumentType} from '@typegoose/typegoose'
import {ObjectType, Field, ArgsType, Float} from 'type-graphql'

@ObjectType()
@modelOptions({ schemaOptions: { collection: 'Products.Offers' } })
export class OffersBase{
	
	@Field()
	@prop({required:true})
	public name: string

	@Field()
	@prop({required:true})
	public quantity: number

	@Field()
	@prop({required:true})
	public giftQuantity: number

	@Field()
	@prop({required:true})
	public newPrice: number

	@Field()
	@prop({required:true})
	public daysDuration: number

	@Field()
	@prop({required:true})
	public startDate: Date
	
	@Field({nullable: true})
	@prop({required: true})
	public endDate?: Date

}


@ArgsType()
export class InputOffers implements Partial<OffersBase> {
	@Field()
	@prop({required:true})
	public name: string

	@Field()
	public quantity: number

	@Field()
	public giftQuantity: number

	@Field()
	public newPrice: number

	@Field()
	public startDate: Date
	
	@Field()
	public endDate: Date

	@Field()
	public daysDuration: number
}

@ArgsType()
export class UpdateOffers extends InputOffers{
	@Field({description:'Requerido'})
	public id: string
}

@ObjectType()
export class OffersMain extends OffersBase{	
	
	@Field({description:'Requerido'})
	public _id: string

	public async CreateUpdateOffers (this: DocumentType<OffersMain>, data:InputOffers){
		this.name = data.name
		this.quantity = data.quantity
		this.giftQuantity = data.giftQuantity
		this.newPrice = data.newPrice
		this.startDate = data.startDate
		this.endDate = data.endDate
		this.daysDuration = data.daysDuration
		await this.save()
	}
	
	public async DeleteOffers (this: DocumentType<OffersMain>){
		this.deleteOne({_id : this._id})
	}
}

@ObjectType()
export class OffersResponse extends OffersBase{
	@Field()
	public id : string

}

export const OffersModel = getModelForClass<typeof OffersMain>(OffersMain)

