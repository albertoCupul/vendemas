/* Aqui se declaran los resolvers (query and mutations) del servidor */
import {Resolver, Query, Mutation, Arg, Args } from 'type-graphql'
import { DocumentType } from "@typegoose/typegoose";

import {Types} from 'mongoose'

import {RuleModel, RuleMain, InputRule, UpdateRule, RuleResponse} from '../../../typegoose/schemas/Rules/RuleSchema'
import {LiteralModel, LiteralMain} from '../../../typegoose/schemas/Rules/LiteralSchema'
import {RuleResponseFix, RuleArrayResponseFix, RuleExistInDB, LiteralExistInRule,LiteralExistInDB} from '../../../typegoose/schemas/Rules/middleware'
import {objectLiterals} from '../../../DefaultSettings/defaultValues'



@Resolver(RuleMain)
export class RuleResolver{
    @Query(returns => [RuleResponse])
    async QueryRuleByName (@Arg('name') name:string) : Promise<RuleResponse[]> {
        const rules:DocumentType<RuleMain>[] = await RuleModel.find().findByNamePopulate(name).orFail().exec()
        const response = RuleArrayResponseFix(rules)
        return response
    }

    @Query(returns => RuleResponse)
    async QueryRuleById (@Arg('id') id:string) : Promise<RuleResponse> {
        const rule =await RuleModel.findById(id).populate('idLiteral').exec()
        const response = RuleResponseFix(rule)        
        return  response
    }    
    
    @Query(returns => Boolean)
    async QueryLiteralExistInRule(@Arg('id') id: string) : Promise<Boolean>{
        const response: boolean = await LiteralExistInRule(id)
        return response
    }

    @Mutation(returns => RuleResponse)
    async AddRule (@Args() {name, literal, arrayOperators}: InputRule): Promise<RuleResponse>{   
        let rule = new RuleModel()
        await rule.CreateUpdateRule({name, literal,arrayOperators})  
        const id = rule._id.valueOf()
        const data = await RuleModel.findById(id).populate('idLiteral').exec()
        const response = RuleResponseFix(data)        
        return response
    }

    @Mutation(returns => RuleResponse)
    async UpdateRule (@Args() {id, name, literal, arrayOperators}: UpdateRule): Promise<RuleResponse>{     
        await RuleModel.update({_id:id}, {"$set": {"idLiteral":[]}}, {multi:true})
        const rule =await RuleModel.findById(id).exec()
        await rule.CreateUpdateRule({name, literal, arrayOperators})        
        const data = await RuleModel.findById(id).populate('idLiteral').exec()
        const response = RuleResponseFix(data)        
        return response
    }

    @Mutation(returns => Boolean)
    async DeleteRule (@Arg('id') id:string): Promise<Boolean>{
        const rule = await RuleModel.deleteOne({_id:id})
        if (rule.deletedCount>0) return true
        return false
    }
    
    @Mutation(returns => Boolean)
    async addRuleGeneral () : Promise<Boolean>{                    
        
        objectLiterals.forEach(async obj => {
        const literal = new LiteralModel()
        let name : string = obj.name
        const value : number = obj.value
        const editable : boolean = obj.editable            
        const existInDB = await LiteralExistInDB (name)
        if (!existInDB) {        
            await literal.CreateUpdateLiteral({name, value, editable})
        }
        })
        
        const arrayLiteralsId = objectLiterals.map(async (obj) : Promise<string> => {
                const data = await LiteralModel.findOne({name: obj.name})
                return data._id.valueOf()
            })            
        
        const rule = new RuleModel()
        const name : string = "General"
        
        const existInDB = await RuleExistInDB(name)
        if (!existInDB) {
            await Promise.all(arrayLiteralsId).then(async (literal) => {
                const arrayOperators : Array<string> = ['*']    
                await rule.CreateUpdateRule({name, literal, arrayOperators})  
            })            
        }
        
        return true
    }
}

