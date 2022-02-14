import { ProductsResponse } from "./Product_schema";
import { ProdAttrModel } from "../../Products/Attributes/prodAttributes_Schema";

export async function ProductsResponseFix(data): Promise<ProductsResponse> {
    let response: ProductsResponse;
    let arrayAttr = data.atributesId.map(async (element) => {
        return await ProdAttrModel.findById(element._id.valueOf()).populate(
            "attributeId"
        );
    });
    const atributesId = await Promise.all(arrayAttr);

    response = {
        id: data._id.valueOf(),
        name: data.name,
        sku: data.sku,
        precioCosto: data.precioCosto,
        precioVenta: data.precioVenta,
        categoryId: data.categoryId,
        atributesId: atributesId,
        complementsId: data.complementsId,
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
        
        return {
            id: elemento._id.valueOf(),
            name: elemento.name,
            sku: elemento.sku,
            precioCosto: elemento.precioCosto,
            precioVenta: elemento.precioVenta,
            categoryId: elemento.categoryId,
            atributesId: atributesId,
            complementsId: elemento.complementsId,
        };
    });
    return arrayProducts;
}
