import {ComplementResponse} from './complementSchema'

export function ComplementResponseFix (rule) {
    const data = rule.toObject()
    let response : ComplementResponse
    response = {
        name : data.name,
        id : data._id.valueOf(),
        precio: data.precio
    } 
    return response
  }
  
  export function ComplementArrayResponseFix (rules){
  
    const arrayComplement: Array<ComplementResponse> = []  
    rules.forEach(elemento => {
        arrayComplement.push({
        name: elemento.name,
        id: elemento._id.valueOf(),
        precio: elemento.precio
      })
    })
    return arrayComplement
  }