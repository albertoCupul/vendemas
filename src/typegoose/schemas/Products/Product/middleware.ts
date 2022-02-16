import { ProductsResponse } from "./Product_schema";
import { ProdAttrModel } from "../../Products/Attributes/prodAttributes_Schema";
import {SellUnityModel} from "../SellUnity/SellUnity_schema"

export async function ProductsResponseFix(data): Promise<ProductsResponse> {
    let response: ProductsResponse;
    let arrayAttr = data.atributesId.map(async (element) => {
        return await ProdAttrModel.findById(element._id.valueOf()).populate(
            "attributeId"
        );
    });
    const atributesId = await Promise.all(arrayAttr);
    const SellUnity = await SellUnityModel.findById(data.sellUnityId)

    response = {
        id: data._id.valueOf(),
        name: data.name,
        sku: data.sku,
        precioCosto: data.precioCosto,
        precioVenta: data.precioVenta,
        categoryId: data.categoryId,
        atributesId: atributesId,
        complementsId: data.complementsId,
        sellUnityId: SellUnity
    };
    return response;
}

export async function ProductsArrayResponseFix(data) {
    const arrayProducts : Array<ProductsResponse> = data.map(async (elemento) => {       
        let arrayAttr = elemento.atributesId.map(async (element) => {
            return await ProdAttrModel.findById(element._id.valueOf()).populate(
                "attributeId"
            );
        });
        const atributesId = await Promise.all(arrayAttr);
        const SellUnity = await SellUnityModel.findById(data.sellUnityId)
        console.log(SellUnity)
        return {
            id: elemento._id.valueOf(),
            name: elemento.name,
            sku: elemento.sku,
            precioCosto: elemento.precioCosto,
            precioVenta: elemento.precioVenta,
            categoryId: elemento.categoryId,
            atributesId: atributesId,
            complementsId: elemento.complementsId,
            sellUnityId: SellUnity
        };
    });
    return arrayProducts;
}
