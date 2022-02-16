import {InputLiteral} from '../typegoose/schemas/Rules/LiteralSchema'


/****** ---------------------------------------------*******/
/****** --------- Listado de Literales  ---------------*******/
/****** ---------------------------------------------*******/
export const objectLiterals : Array<InputLiteral> = [
      {
            name: 'I.V.A.',
            value: 16,
            editable: false
      },
      {
            name: 'Precio Costo',
            value: 1,
            editable: false
      },
      {
        name: 'Precio Venta',
        value: 1,
        editable: false
  }
]



/****** ---------------------------------------------*******/
/****** --------- Listado de Modulos  ---------------*******/
/****** ---------------------------------------------*******/

export const listModules : Array<string> = ["system", "catalogo", "clientes",
            "inventario", "ventas", "reportes", "auditoria", "devoluciones"]    
            
/****** ---------------------------------------------*******/
/****** --- Listado de Perfiles de Usuario  ---------*******/
/****** ---------------------------------------------*******/

type ObjPerfil = {
  name : string,
  modules: Array<string>
}
type listadoPerfil = {
  perfil: Array<ObjPerfil>
}
export const listPerfil = {
  perfil: [    
    {
      name: "Administrador",
      modules: ["system", "catalogo", "clientes", "inventario", "ventas", "reportes", "auditoria", "devoluciones"]  
    },
    {
      name: "Gerente",
      modules: ["catalogo", "clientes", "inventario", "ventas", "reportes", "auditoria", "devoluciones"]  
    },
    {
      name: "Responsable de Inventario",
      modules: ["inventario"]  
    },
    {
      name: "Mercadólogo",
      modules: ["catalogo", "inventario"]  
    },
    {
      name: "Responsable de Turno",
      modules: ["clientes", "inventario", "ventas", "reportes", "auditoria", "devoluciones"]  
    },
    {
      name: "Cajero",
      modules: ["ventas"]  
    },
  ]
}


/****** ---------------------------------------------*******/
/****** --- Perfil de Cliente General --*******/
/****** ---------------------------------------------*******/

export const ClienteGeneralPerfil = {
      name: 'General',
      ruleName: 'General'
}

/****** ---------------------------------------------*******/
/****** --- Cliente General --*******/
/****** ---------------------------------------------*******/

export const ClienteGeneral = {
      name: 'Cliente',
      first: 'General',
      second:'',
      fullName: 'Cliente General',
      address:'',
      references:'',
      phone:'',
      rfc:'',
      credit:0,
      perfilName: 'General'
}

/****** ---------------------------------------------*******/
/****** --- Categoría de Producto Principal --*******/
/****** ---------------------------------------------*******/

export const categoryMain = "Sin categoría"


/****** ---------------------------------------------*******/
/****** --- SellUnity (Unidades de venta) de Productos  --*******/
/****** ---------------------------------------------*******/
export const DefaultSellUnity =[
  {name:"Servicio", SATKey: "E48"},
  {name:"Pieza", SATKey: "H87"},
  {name:"Kilogramo", SATKey: "KGM"},
  {name:"Metro", SATKey: "MTR"},
  {name:"Metro Cuadrado", SATKey: "MTK"},
  {name:"Elemento", SATKey: "EA"},
  {name:"Actividad", SATKey: "ACT"},
  {name:"Litro", SATKey: "LTR"},
  {name:"Hora", SATKey: "HUR"},
  {name:"Trabajo", SATKey: "E51"},
  {name:"Día", SATKey: "DAY"},
  {name:"Viaje", SATKey: "E58"},
]