import {getModelForClass, prop, Ref, modelOptions, QueryMethod, DocumentType} from '@typegoose/typegoose'
import {ObjectType, Field, ArgsType,ID} from 'type-graphql'

import {RuleResponse, RuleMain, RuleModel} from '../Rules/RuleSchema'

@ObjectType()
@modelOptions({ schemaOptions: { collection: 'Client.Perfil' } })
class PerfilBase {
	
	@Field({description: 'Requerido'})
	@prop({required: true, unique: true}) 
	public name: string

}

@ArgsType()
export class InputClientPerfil implements Partial<PerfilBase>{
	
	@Field({description: 'Requerido'})
	public name: string
	
	@Field()
	public ruleID: string
}

@ArgsType()
export class UpdateClientPerfil extends InputClientPerfil{
	
	@Field()
	public id: string
}

@ObjectType()
export class ClientPerfilMain extends PerfilBase{
	
	@Field(type => String)
	@prop({ref:() => RuleMain})
	public idRule : Ref<RuleMain>
	
	
	public async CreateAndUpdate (this: DocumentType<ClientPerfilMain>, data:{name:string, rule: RuleMain}){
		this.name = data.name
		this.idRule = data.rule
		await this.save()
	}	
	
		public async DeleteIt (this: DocumentType<ClientPerfilMain>){
		this.deleteOne({_id : this._id})
	}
	
}

@ObjectType()
export class ClientPerfilResponse extends PerfilBase{
	
	@Field()
	public id : string
	
	@Field(type => RuleResponse)
	public idRule : RuleResponse
}

export const PerfilModel = getModelForClass(ClientPerfilMain)
/*<typeof RuleMain, QueryHelpers>*/

