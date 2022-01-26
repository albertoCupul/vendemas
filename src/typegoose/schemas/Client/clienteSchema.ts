import {getModelForClass, prop, Ref, modelOptions, QueryMethod, DocumentType} from '@typegoose/typegoose'
import {ObjectType, Field, ArgsType,ID} from 'type-graphql'

import {PerfilModel, ClientPerfilMain, ClientPerfilResponse} from '../Client/clPerfilSchema'

@ObjectType()
@modelOptions({ schemaOptions: { collection: 'Client.Main' } })
class ClientBase {
  
  @Field()
  @prop({required: true})
  public name : string
  
  @Field()
  @prop({required: true})
  public first : string
  
  @Field()
  @prop()
  public second : string
  
  @Field()
  @prop({required: true})
  public fullName : string
  
  @Field()
  @prop({required: true})
  public registerDate : Date
  
  @Field()
  @prop()
  public address : string
  
  @Field()
  @prop()
  public references : string
  
  @Field()
  @prop()
  public phone : string
  
  @Field()
  @prop()
  public rfc : string
  
  @Field()
  @prop()
  public credit : number
  
}

@ArgsType()
export class InputClient implements Partial<ClientBase> {
  
  @Field()
  @prop({required: true})
  public name : string
  
  @Field()
  @prop({required: true})
  public first : string
  
  @Field()
  @prop()
  public second : string
  
  @Field()
  @prop()
  public address : string
  
  @Field()
  @prop()
  public references : string
  
  @Field()
  @prop()
  public phone : string
  
  @Field()
  @prop()
  public rfc : string
  
  @Field()
  @prop()
  public credit : number
  
  @Field()
	public PerfilID : string
  
}

@ArgsType()
export class UpdateClient extends InputClient {
  @Field()
  public id : string
}

@ObjectType()
export class ClientMain extends ClientBase{
  
  @Field()
  public _id : string
  
  @Field(type => ID)
  @prop({ref:() => ClientPerfilMain})
  public idPerfil : Ref<ClientPerfilMain>
  
  public async CreateAndUpdateClient(this: DocumentType<ClientMain>, data:{name:string, 
  first:string, second:string, address:string, references:string, phone:string, rfc:string,
  credit:number, perfil:ClientPerfilMain}){
    this.name = data.name
    this.first = data.first
    this.second = data.second
    this.fullName = data.second ? data.name+' '+data.first+' '+data.second : data.name+' '+data.first
    this.address = data.address
    this.references = data.references
    this.phone = data.phone
    this.rfc = data.rfc
    this.credit= data.credit
    this.idPerfil = data.perfil
    this.registerDate = new Date(Date.now())
    await this.save()
  }
  
}

@ObjectType()
export class ClientResponse extends ClientBase{
  @Field()
  public id : string
  
  @Field(type => ClientPerfilResponse)  
  public objectPerfil : ClientPerfilResponse
  
}

export const ClientModel = getModelForClass/*<typeof UserMain, QueryHelpers>*/(ClientMain)

