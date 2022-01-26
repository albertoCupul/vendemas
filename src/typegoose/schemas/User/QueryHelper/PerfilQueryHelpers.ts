/* en este archivo de se declaran las funciones de los auxiliares de consulta (QueryHelpers)*/

import {  types, ReturnModelType} from '@typegoose/typegoose'
import {ObjectType} from 'type-graphql'
import {Types} from 'mongoose'
import {PerfilMain} from '../userPerfilSchema'

@ObjectType()
export class QueryHelpers {
	//findByName: types.AsQueryMethod<typeof findByName>
	findByRef: types.AsQueryMethod<typeof findByRef>	
}

/*export function findByName (this: ReturnModelType<typeof PerfilMain, QueryHelpers>, name:string){
	return this.find({fullName:{$regex: name, $options: 'i'}})
}*/

export function findByRef(this: ReturnModelType<typeof PerfilMain, QueryHelpers>, data:{idPerfil:string, idModule:string}){
	return this.findOne({idModules:new Types.ObjectId(data.idModule), _id: data.idPerfil}).populate('idModules')
}
