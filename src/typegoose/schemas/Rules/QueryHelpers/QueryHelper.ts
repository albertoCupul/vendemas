import { types, ReturnModelType } from '@typegoose/typegoose'
import {ObjectType} from 'type-graphql'
import {LiteralMain} from '../LiteralSchema'

@ObjectType()
export class QueryHelpers {
  findByName: types.AsQueryMethod<typeof findByName>
  //findByRef: types.AsQueryMethod<typeof findByRef>
}

export function findByName (this: ReturnModelType <typeof LiteralMain, QueryHelpers>, name:string){
  return this.find({name: {$regex: name, $options: 'i'}})
}

/*export function findByRef (this: ReturnModelType <typeof LiteralMain, QueryHelpers>, id:string){
  return this.findOne({_id: id})
  return this.findOne({idAccess:new Types.ObjectId(id)}).populate('idAccess')
}*/
