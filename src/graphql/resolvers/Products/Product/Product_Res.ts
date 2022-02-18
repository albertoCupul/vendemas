import { Resolver, Query, Mutation, Arg, Args, Int } from "type-graphql";

import {
    InputProducts,
    UpdateProducts,
    ProductsMain,
    ProductsModel,
    ProductsResponse,
} from "../../../../typegoose/schemas/Products/Product/Product_schema";

import {
    ProductsArrayResponseFix,
    ProductsResponseFix,
} from "../../../../typegoose/schemas/Products/Product/middleware";

@Resolver(ProductsMain)
export class ProductsResolver {
    @Query((returns) => [ProductsResponse])
    async QueryProductByName(
        @Arg("name") name: string
    ): Promise<ProductsResponse[]> {
        const Product = await ProductsModel.find({
            name: { $regex: name, $options: "i" },
        })
            .populate("categoryId")
            .populate("atributesId")
            .populate("complementsId")
            .populate("OffersId")       
        const response: Array<ProductsResponse> =
            await ProductsArrayResponseFix(Product);
        return response;
    }

    @Query((returns) => ProductsResponse)
    async QueryProductById(@Arg("id") id: string): Promise<ProductsResponse> {
        const Product = await ProductsModel.findById(id)
            .populate("categoryId")
            .populate("atributesId")
            .populate("complementsId")
            .populate("OffersId")
        const response: ProductsResponse = await ProductsResponseFix(Product);
        return response;
    }

    @Mutation((returns) => ProductsResponse)
    async AddProducts(@Args() data: InputProducts): Promise<ProductsResponse> {
        let Products = new ProductsModel();
        let productCreated: boolean = false;
        let response: ProductsResponse;
        const existProducts = await ProductsModel.findOne({
            name: data.name,
        });
        if (!existProducts) {
            await Products.CreateUpdateProducts(data);
            Products = await ProductsModel.findById(Products._id.valueOf())
                .populate("categoryId")
                .populate("atributesId")
                .populate("complementsId")
                .populate("OffersId")
            if (Products) {
                response = await ProductsResponseFix(Products);
                productCreated = true;
            }
        }
        if (!productCreated) {
            response = {
                name: "",
                sku: "",
                precioCosto: 0.0,
                precioVenta: 0.0,
                categoryId: null,
                atributesId: [null],
                complementsId: [null],
                sellUnityId:null,
                inventoryId: null,
                OffersId:[null]
            };
        }

        return response;
    }

    @Mutation((returns) => ProductsResponse)
    async UpdateProducts(
        @Args() data: UpdateProducts
    ): Promise<ProductsResponse> {
        let Products = new ProductsModel();
        let response: ProductsResponse;
        const existProducts = await ProductsModel.findById(data.id);
        const existName = await ProductsModel.findOne({
            name: data.name,
            _id: { $ne: data.id },
        });
        if (existProducts && !existName) {
            await existProducts.CreateUpdateProducts(data);
            Products = await ProductsModel.findById(data.id.valueOf())
                .populate("categoryId")
                .populate("atributesId")
                .populate("complementsId")
                .populate("OffersId")
            response = await ProductsResponseFix(Products);
        } else {
            response = {
                name: "",
                sku: "",
                precioCosto: 0.0,
                precioVenta: 0.0,
                categoryId: null,
                atributesId: [null],
                complementsId: [null],
                sellUnityId:null,
                inventoryId: null,
                OffersId: [null]
            };
        }
        return response;
    }

    @Mutation((returns) => Boolean)
    async DeleteProducts(@Arg("id") id: string): Promise<Boolean> {
        let response: boolean = false;
        const existProducts = await ProductsModel.findById(id);
        if (existProducts) {
            await existProducts.DeleteProducts();
            response = true;
        }
        return response;
    }
}
