import {ClientPerfilResponse, PerfilModel} from './clPerfilSchema'
import {ClientResponse} from './clienteSchema'
import {RuleResponseFix} from '../Rules/middleware'

/****** ----------------------------------------------*******/
/****** --------------- Client Perfil ----------------*******/
/****** ----------------------------------------------*******/

export function PerfilResponseFix(objeto): ClientPerfilResponse{
  const rule = RuleResponseFix(objeto.idRule)
  const response : ClientPerfilResponse = {
    name: objeto.name,
    idRule: rule,
    id: objeto._id.valueOf()    
  }
  return response
}

export async function ClientResponseFix(objeto): Promise<ClientResponse>{
  const perfil = await PerfilModel.findById(objeto.idPerfil._id.valueOf()).populate('idRule')
  const perfilResponse = PerfilResponseFix(perfil)
  const response : ClientResponse = {
    name: objeto.name,
    first: objeto.first,
    second: objeto.second,
    fullName: objeto.second ? objeto.name+' '+objeto.first+' '+objeto.second : objeto.name+' '+objeto.first,
    address: objeto.address,
    references: objeto.references,
    phone: objeto.phone,
    rfc: objeto.rfc,
    credit: objeto.credit,
    registerDate: objeto.registerDate,
    id: objeto._id.valueOf(),
    objectPerfil: perfilResponse
  }
  return response
}

export async function ClientArrayResponseFix(objeto) : Promise<ClientResponse[]>{
  let arrayClient : Array<ClientResponse> = []
  let response : Array<ClientResponse> = []
  arrayClient = objeto.map(async elemento => {
    const client = await ClientResponseFix(elemento)
    return client
  })
  response = await Promise.all(arrayClient).then(async valor => {
    return valor
  })
  return response
}
