import {UserMain, UserResponse} from '../../../typegoose/schemas/User/userSchema'
import {UsrAccResponse, UserAccessModel} from '../../../typegoose/schemas/User/usrAccSchema'
import {ModuleResponse, ModuleModel} from  '../../../typegoose/schemas/User/userModules'
import {PerfilResponse, PerfilModel} from  '../../../typegoose/schemas/User/userPerfilSchema'

function FillAccessType(UserAccessObject): UsrAccResponse{  
  const AccesObject : UsrAccResponse = {
    user: UserAccessObject.user,
    login: UserAccessObject.login,
    id: UserAccessObject._id.valueOf()
  }
  return AccesObject
}

export function UserResponseFix (User) {
  const data = User.toObject()
  const Access : UsrAccResponse = FillAccessType(data.idAccess)
  const Perfil : PerfilResponse = perfilResponseFix(data.idPerfil)
  let response : UserResponse
  response = {
      name : data.name,
      id : data._id.valueOf(),
      first: data.first,
      second: data.second,
      fullName: data.name +' '+data.first+' '+data.second,
      phone: data.phone,
      registerDate: data.registerDate,
      objectAccess: Access,
      objectPerfil: Perfil
  } 
  return response
}

export function UserArrayResponseFix (users){

  const arrayUsers: Array<UserResponse> = []  
  users.forEach(elemento => {
    const Access : UsrAccResponse = FillAccessType(elemento.idAccess)
    arrayUsers.push({
      name: elemento.name,
      id: elemento._id.valueOf(),
      first: elemento.first,
      second: elemento.second,
      fullName: elemento.fullName,
      phone: elemento.phone,
      registerDate: elemento.registerDate,
      objectAccess: Access
    })
  })
  return arrayUsers
}
/****** ---------------------------------------------*******/
/****** --------------- Accesos  --------------------*******/
/****** ---------------------------------------------*******/

export function accessResponseFix (access) {
  const data = access.toObject()
  let response : UsrAccResponse
  response = {
      user : data.user,
      //pwd : data.pwd,
      login: data.login,
      id: data._id.valueOf()
  } 
  return response
}

export async function existUser (userName:string, id:string){
   let response:boolean = false  
  const user = await UserAccessModel.findOne({user: userName})
  if (user !==null && user._id.valueOf() !== id)  response = true
  return response 
}

/****** ---------------------------------------------*******/
/****** --------------- Modules  --------------------*******/
/****** ---------------------------------------------*******/

export function moduleResponseFix (module) {
  const data = module.toObject()
  let response : ModuleResponse
  response = {
      name : data.name,
      id: data._id.valueOf()
  } 
  return response
}

export function moduleArrayResponseFix (module): Array<ModuleResponse> {
  let response : Array<ModuleResponse> = []
  module.forEach(elemento =>{
    response.push({
      id: elemento._id.valueOf(),
      name: elemento.name
    })
  })
  return response
}

export async function existInDB (name:string) {
  const module = await ModuleModel.findOne({name:name})
  let response : boolean = false
  if (module !== null ) response = true
  return response
}


/****** ---------------------------------------------*******/
/****** --------------- Perfil  --------------------*******/
/****** ---------------------------------------------*******/

function FillModuleType(arrayModulos): Array<ModuleResponse>{  
  const moduleObject : Array<ModuleResponse> =[]
  arrayModulos.forEach(elemento => {
    moduleObject.push({
      name: elemento.name,
      id: elemento._id.valueOf()
    })
  }) 
  return moduleObject
}



export function perfilResponseFix (data) {
  const arrayModulos : Array<ModuleResponse> = FillModuleType(data.idModules)
  const response : PerfilResponse = {
      id: data._id.valueOf(),
      name: data.name,
      objectModules: arrayModulos
    } 
  return response
}

export function perfilArrayResponseFix (perfil): Array<PerfilResponse> {
  let response : Array<PerfilResponse> = []
  perfil.forEach(elemento =>{
    const arrayModulos : Array<ModuleResponse> = FillModuleType(elemento.idModules)
    response.push({
      id: elemento._id.valueOf(),
      name: elemento.name,
      objectModules: arrayModulos
    })
  })
  return response
}

export async function existInDBPerfil (name:string) {
  const perfil = await PerfilModel.findOne({name:name})
  let response : boolean = false
  if (perfil !== null ) response = true
  return response
}

export async function modelExistInRule (idPerfil, idModule){
  let response:boolean = false  
  const perfil = await PerfilModel.find().findByRef({idPerfil, idModule})
  if (perfil !==null)  response = true
  return response 
}
