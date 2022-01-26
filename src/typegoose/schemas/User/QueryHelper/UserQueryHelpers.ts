/* en este archivo de se declaran las funciones de los auxiliares de consulta (QueryHelpers)*/

import {  types, ReturnModelType} from '@typegoose/typegoose'
import {ObjectType} from 'type-graphql'
import {Types} from 'mongoose'
import {UserMain} from '../userSchema'

@ObjectType()
export class QueryHelpers {
	findByName: types.AsQueryMethod<typeof findByName>
	findByRef: types.AsQueryMethod<typeof findByRef>	
}

export function findByName (this: ReturnModelType<typeof UserMain, QueryHelpers>, name:string){
	return this.find({fullName:{$regex: name, $options: 'i'}})
}

export function findByRef(this: ReturnModelType<typeof UserMain, QueryHelpers>, id:string){
	return this.findOne({idAccess:new Types.ObjectId(id)}).populate('idAccess')
}
