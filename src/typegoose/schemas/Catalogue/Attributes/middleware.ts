import {AttributeResponse} from './attributeSchema'

export function AttributeResponseFix (rule) {
    const data = rule.toObject()
    let response : AttributeResponse
    response = {
        name : data.name,
        id : data._id.valueOf(),
    } 
    return response
  }
  
  export function AttributeArrayResponseFix (rules){
  
    const arrayAttribute: Array<AttributeResponse> = []  
    rules.forEach(elemento => {
        arrayAttribute.push({
        name: elemento.name,
        id: elemento._id.valueOf(),
      })
    })
    return arrayAttribute
  }