import {CategoryResponse} from './categorySchema'

export function CategoryResponseFix (rule) {
    const data = rule.toObject()
    let response : CategoryResponse
    response = {
        name : data.name,
        id : data._id.valueOf(),
        editable: data.editable
    } 
    return response
  }
  
  export function CategoryArrayResponseFix (rules){
  
    const arrayCategory: Array<CategoryResponse> = []  
    rules.forEach(elemento => {
        arrayCategory.push({
        name: elemento.name,
        id: elemento._id.valueOf(),
        editable: elemento.editable
      })
    })
    return arrayCategory
  }