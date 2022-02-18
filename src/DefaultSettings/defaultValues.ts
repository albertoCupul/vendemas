import { InputLiteral } from "../typegoose/schemas/Rules/LiteralSchema";

/****** ---------------------------------------------*******/
/****** --------- Listado de Literales  ---------------*******/
/****** ---------------------------------------------*******/
export const objectLiterals: Array<InputLiteral> = [
    {
        name: "I.V.A.",
        value: 16,
        editable: false,
    },
    {
        name: "Precio Costo",
        value: 1,
        editable: false,
    },
    {
        name: "Precio Venta",
        value: 1,
        editable: false,
    },
];

/****** ---------------------------------------------*******/
/****** --------- Listado de Modulos  ---------------*******/
/****** ---------------------------------------------*******/

export const listModules: Array<string> = [
    "system",
    "catalogo",
    "clientes",
    "inventario",
    "ventas",
    "reportes",
    "auditoria",
    "devoluciones",
];

/****** ---------------------------------------------*******/
/****** --- Listado de Perfiles de Usuario  ---------*******/
/****** ---------------------------------------------*******/

type ObjPerfil = {
    name: string;
    modules: Array<string>;
};
type listadoPerfil = {
    perfil: Array<ObjPerfil>;
};
export const listPerfil = {
    perfil: [
        {
            name: "Administrador",
            modules: [
                "system",
                "catalogo",
                "clientes",
                "inventario",
                "ventas",
                "reportes",
                "auditoria",
                "devoluciones",
            ],
        },
        {
            name: "Gerente",
            modules: [
                "catalogo",
                "clientes",
                "inventario",
                "ventas",
                "reportes",
                "auditoria",
                "devoluciones",
            ],
        },
        {
            name: "Responsable de Inventario",
            modules: ["inventario"],
        },
        {
            name: "Mercadólogo",
            modules: ["catalogo", "inventario"],
        },
        {
            name: "Responsable de Turno",
            modules: [
                "clientes",
                "inventario",
                "ventas",
                "reportes",
                "auditoria",
                "devoluciones",
            ],
        },
        {
            name: "Cajero",
            modules: ["ventas"],
        },
    ],
};

/****** ---------------------------------------------*******/
/****** --- Perfil de Cliente General --*******/
/****** ---------------------------------------------*******/

export const ClienteGeneralPerfil = {
    name: "General",
    ruleName: "General",
};

/****** ---------------------------------------------*******/
/****** --- Cliente General --*******/
/****** ---------------------------------------------*******/

export const ClienteGeneral = {
    name: "Cliente",
    first: "General",
    second: "",
    fullName: "Cliente General",
    address: "",
    references: "",
    phone: "",
    rfc: "",
    credit: 0,
    perfilName: "General",
};

/****** ---------------------------------------------*******/
/****** --- Categoría de Producto Principal --*******/
/****** ---------------------------------------------*******/

export const categoryMain = "Sin categoría";

/****** ---------------------------------------------*******/
/****** --- SellUnity (Unidades de venta) de Productos  --*******/
/****** ---------------------------------------------*******/
export const DefaultSellUnity = [
    { name: "Servicio", SATKey: "E48" },
    { name: "Pieza", SATKey: "H87" },
    { name: "Kilogramo", SATKey: "KGM" },
    { name: "Metro", SATKey: "MTR" },
    { name: "Metro Cuadrado", SATKey: "MTK" },
    { name: "Elemento", SATKey: "EA" },
    { name: "Actividad", SATKey: "ACT" },
    { name: "Litro", SATKey: "LTR" },
    { name: "Hora", SATKey: "HUR" },
    { name: "Trabajo", SATKey: "E51" },
    { name: "Día", SATKey: "DAY" },
    { name: "Viaje", SATKey: "E58" },
];

/****** ---------------------------------------------*******/
/****** --- MethodsPay (métodos de pago) del SAT  --*******/
/****** ---------------------------------------------*******/
export const DefaultMethodsPay = [
    {
        name: "Efectivo",
        SATKey: "001",
        description:
            "Consiste en el pago realizado con dinero directamente en el establecimiento.",
    },
    {
        name: "Cheque Nominativo",
        SATKey: "002",
        description:
            "La empresa o persona que paga el servicio emite un cheque a nombre del beneficiado.",
    },
    {
        name: "Transferencia Electrónica de Fondos SPEI",
        SATKey: "003",
        description:
            "Transferencia electrónica de banco a banco sin importar si son cuentahabiente de la misma institución.",
    },
    {
        name: "Tarjeta de Crédito",
        SATKey: "004",
        description:
            "El pago se realiza con tarjeta de crédito y regularmente se especifica en la factura la terminación de la tarjeta.",
    },
    {
        name: "Monedero Electrónico",
        SATKey: "005",
        description:
            "Al ser un monedero autorizado por el SAT, se puede realizar el pago con el monedero electrónico.",
    },
    {
        name: "Dinero Electrónico",
        SATKey: "006",
        description:
            "El dinero electrónico es el capital almacenado en un hardware.",
    },
    {
        name: "Vales de Despensa",
        SATKey: "008",
        description:
            "Vales que el contribuyente es acreedor por parte de una empresa.",
    },
    {
        name: "Tarjeta de Débito",
        SATKey: "028",
        description:
            "Sin importar la institución de la que se trate la tarjeta, éste siempre deberá tener fondos",
    },
    {
        name: "Tarjeta de Servicios",
        SATKey: "029",
        description:
            "Mientras la tarjeta esté emitida por el sistema financiero mexicano.",
    },
    {
        name: "Aplicación de Anticipos",
        SATKey: "030",
        description:
            "Se trata de pagos anticipados, estos deberán verse reflejado en complemento de factura.",
    },
    {
        name: "Por Definir",
        SATKey: "099",
        description:
            "Esta opción se especificará para que el contribuyente dé el trato contable que le interese.",
    },
];
