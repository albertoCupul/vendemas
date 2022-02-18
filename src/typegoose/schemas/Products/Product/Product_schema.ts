import {
    getModelForClass,
    prop,
    Ref,
    modelOptions,
    QueryMethod,
    DocumentType,
} from "@typegoose/typegoose";

import { ObjectType, Field, ArgsType, Float } from "type-graphql";

import { CategoryMain, CategoryModel } from "../Category/categorySchema";

import { existCategoryInDB } from "../Category/middleware";

import {
    ComplementMain,
    ComplementModel,
} from "../Complement/complementSchema";

import {
    ProdAttrMain,
    ProdAttrModel,
} from "../Attributes/prodAttributes_Schema";

import { InventoryModel, InventoryMain } from "../Inventory/Inventory_schema";

import { SellUnityModel, SellUnityMain } from "../SellUnity/SellUnity_schema";
import { OffersMain, OffersModel } from "../offers/offers_schema";

@ObjectType()
@modelOptions({ schemaOptions: { collection: "Products.Products" } })
export class ProductsBase {
    @Field({ description: "Requerido" })
    @prop({ required: true, default: false })
    public name: string;

    @Field({ description: "Requerido" })
    @prop({ required: true })
    public sku: string;

    @Field({ description: "Requerido" })
    @prop({ required: true })
    public precioCosto: number;

    @Field({ description: "Requerido" })
    @prop({ required: true })
    public precioVenta: number;

    @Field((type) => CategoryMain, { nullable: true })
    @prop({ ref: () => CategoryMain })
    public categoryId: CategoryMain;

    @Field((type) => [ProdAttrMain])
    @prop({ ref: () => ProdAttrMain })
    public atributesId: Ref<ProdAttrMain>[];

    @Field((type) => [ComplementMain])
    @prop({ ref: () => ComplementMain })
    public complementsId: Ref<ComplementMain>[];

    @Field((type) => [OffersMain])
    @prop({ ref: () => OffersMain, required:false })
    public OffersId: Ref<OffersMain>[];

    @Field((type) => SellUnityMain, { nullable: true })
    @prop({ ref: () => SellUnityMain })
    public sellUnityId: SellUnityMain;

    @Field((type) => InventoryMain, { nullable: true })
    @prop({ ref: () => InventoryMain })
    public inventoryId: InventoryMain;
}

@ArgsType()
export class InputProducts implements Partial<ProductsBase> {
    @Field({ description: "Requerido" })
    public name: string;

    @Field({ description: "Requerido" })
    public sku: string;

    @Field({ description: "Requerido" })
    public precioCosto: number;

    @Field({ description: "Requerido" })
    public precioVenta: number;

    @Field({ description: "Requerido" })
    public category: string;

    @Field((type) => [String])
    public atributes: Array<string>;

    @Field((type) => [String])
    public complements: Array<string>;

    @Field((type) => String)
    public sellUnity: string;

    @Field((type) => String)
    public inventory: string;

    @Field((type) => [String])
    public Offers: Array<string>;
}

@ArgsType()
export class UpdateProducts extends InputProducts {
    @Field({ description: "Requerido" })
    public id: string;
}

@ObjectType()
export class ProductsMain extends ProductsBase {
    public async CreateUpdateProducts(
        this: DocumentType<ProductsMain>,
        data: InputProducts
    ) {
        const arrayAttr = data.atributes.map(async (id) => {
            if (id){
                return await ProdAttrModel.findById(id);
            }
        });

        const arrayCompl = data.complements.map(async (id) => {
            if (id){
                return await ComplementModel.findById(id);
            }
        });
        
        const arrayOffers = data.Offers.map(async (id) => {
            if (id){
                return await OffersModel.findById(id);
            }
        });

        console.log(arrayOffers)

        const existCategory = await CategoryModel.findById(data.category);

        const existSellUnity = await SellUnityModel.findById(data.sellUnity);

        const existInventory = await InventoryModel.findById(data.inventory);

        const atributesId = await Promise.all(arrayAttr);
        const complementsId = await Promise.all(arrayCompl);
        const offersId = await Promise.all(arrayOffers);

        const existNullAtributes = atributesId.includes(null);
        const existNullComplements = complementsId.includes(null);
        const existNullOffers = offersId.includes(null);

        if (
            !existNullAtributes &&
            !existNullComplements &&
            !existNullOffers &&
            existCategory &&
            existSellUnity &&
            existInventory
        ) {
            this.name = data.name;
            this.sku = data.sku;
            this.precioVenta = data.precioVenta;
            this.precioCosto = data.precioCosto;
            this.categoryId = existCategory;
            this.atributesId = atributesId;
            this.complementsId = complementsId;
            this.sellUnityId = existSellUnity;
            this.inventoryId = existInventory
            this.OffersId = offersId
            await this.save();
        }
    }

    public async DeleteProducts(this: DocumentType<ProductsMain>) {
        this.deleteOne({ _id: this._id });
    }
}

@ObjectType()
export class ProductsResponse extends ProductsBase {
    @Field()
    public id?: string;

}

export const ProductsModel =
    getModelForClass<typeof ProductsMain>(ProductsMain);
