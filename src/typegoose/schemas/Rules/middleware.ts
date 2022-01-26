import {RuleResponse, RuleModel} from '../../../typegoose/schemas/Rules/RuleSchema'
import {LiteralResult, LiteralModel} from '../../../typegoose/schemas/Rules/LiteralSchema'

function FillLiteralType(objectLiteral): Array<LiteralResult>{
  const arrayLiteral : Array<LiteralResult> = []
  objectLiteral.forEach(elemento =>{
    arrayLiteral.push({
      name: elemento.name,
      value: elemento.value,
      editable: elemento.editable,
      id: elemento._id.valueOf()
      })
  })
  return arrayLiteral
}

export function RuleResponseFix (rule) {
  const data = rule.toObject()
  const arrayLiteral : Array<LiteralResult> = FillLiteralType(data.idLiteral)
  let response : RuleResponse
  response = {
      name : data.name,
      id : data._id.valueOf(),
      objectLiterals: arrayLiteral,
      arrayOperators: data.arrayOperators
  } 
  return response
}

export function RuleArrayResponseFix (rules){

  const arrayRules: Array<RuleResponse> = []  
  rules.forEach(elemento => {
    const arrayLiteral : Array<LiteralResult> = FillLiteralType(elemento.idLiteral)
    arrayRules.push({
      name: elemento.name,
      id: elemento._id.valueOf(),
      objectLiterals: arrayLiteral,
      arrayOperators: elemento.arrayOperators
    })
  })
  return arrayRules
}

export async function RuleExistInDB (name : string){
  let response:boolean = false  
  const rules = await RuleModel.findOne({name:name})
  if (rules !==null)  response = true
  return response 
}


/****** --------------- Literals  --------------------*******/

export function LiteralArrayResponseFix (literal){
  const arrayLiterals: Array<LiteralResult> = FillLiteralType(literal)  
  return arrayLiterals
}

export function literalResponseFix (literal) {
  const data = literal.toObject()
  let response : LiteralResult
  response = {
      name : data.name,
      id : data._id.valueOf(),
      value: data.value,
      editable: data.editable
  } 
  return response
}

export async function LiteralExistInRule (id){
  let response:boolean = false  
  const rules = await RuleModel.find().findByRef(id)
  if (rules !==null)  response = true
  return response 
}

export async function LiteralExistInDB (name : string){
  let response:boolean = false  
  const rules = await LiteralModel.findOne({name:name})
  if (rules !==null)  response = true
  return response 
}
