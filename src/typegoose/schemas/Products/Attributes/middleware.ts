import {ProdAttrResponse, ProdAttrModel} from './prodAttributes_Schema'

export function ProdAttrResponseFix (rule) {
    const data = rule.toObject()
    let response : ProdAttrResponse
    response = {
        attributeId : data.attributeId,
        id : data._id.valueOf(),
        value: data.value 
    } 
    return response
  }
  
  export function ProdAttrArrayResponseFix (rules){
  
    const arrayProdAttr: Array<ProdAttrResponse> = []  
    rules.forEach(elemento => {
        arrayProdAttr.push({
          attributeId : elemento.attributeId,
          id : elemento._id.valueOf(),
          value: elemento.value 
      })
    })
    return arrayProdAttr
  }

  export async function existProdAttrInDB(id){
    let response : boolean = false
    const existAttr = await ProdAttrModel.findById(id)
    if (existAttr) response = true
    return response
  }