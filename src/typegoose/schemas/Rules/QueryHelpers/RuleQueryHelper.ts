/* en este archivo de se declaran las funciones de los auxiliares de consulta (QueryHelpers)*/

import {  types, ReturnModelType} from '@typegoose/typegoose'
import {ObjectType} from 'type-graphql'
import {RuleMain as Schema} from '../RuleSchema'
import {Types} from 'mongoose'

@ObjectType()
export class QueryHelpers {
	findByNamePopulate: types.AsQueryMethod<typeof findByNamePopulate>
	findByRef: types.AsQueryMethod<typeof findByRef>
}

export function findByNamePopulate (this: ReturnModelType<typeof Schema, QueryHelpers>, name:string){
	return this.find({name:{$regex: name, $options: 'i'}}).populate('idLiteral')
}

export function findByRef(this: ReturnModelType<typeof Schema, QueryHelpers>, id:string){
	return this.findOne({idLiteral: new Types.ObjectId(id)}).populate('idLiteral')
}


