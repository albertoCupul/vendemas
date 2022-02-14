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
import { existProdAttrInDB } from "../Attributes/middleware";

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

    @Field((type) => CategoryMain)
    @prop({ ref: () => CategoryMain })
    public categoryId: string;

    @Field((type) => [ProdAttrMain])
    @prop({ ref: () => ProdAttrMain })
    public atributesId: Ref<ProdAttrMain>[];

    @Field((type) => [ComplementMain])
    @prop({ ref: () => ComplementMain })
    public complementsId: Ref<ComplementMain>[];
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
    public categoryId: string;

    @Field((type) => [String])
    public atributes: Array<string>;

    @Field((type) => [String])
    public complements: Array<string>;
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
            return await ProdAttrModel.findById(id);
        });

        const arrayCompl = data.complements.map(async (id) => {
            return await ComplementModel.findById(id);
        });

        const existCategory = await CategoryModel.findById(data.categoryId);

        const atributesId = await Promise.all(arrayAttr);
        const complementsId = await Promise.all(arrayCompl);

        const existNullAtributes = atributesId.includes(null);
        const existNullComplements = complementsId.includes(null);

        if (!existNullAtributes && !existNullComplements && existCategory) {
            this.name = data.name;
            this.sku = data.sku;
            this.precioVenta = data.precioVenta;
            this.precioCosto = data.precioCosto;
            this.categoryId = data.categoryId;
            this.atributesId = atributesId;
            this.complementsId = complementsId;
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

    /*@Field({ nullable: true })
	public attributeId?: AttributeMain*/
}

export const ProductsModel =
    getModelForClass<typeof ProductsMain>(ProductsMain);
