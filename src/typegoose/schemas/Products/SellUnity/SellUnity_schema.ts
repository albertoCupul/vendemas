import {
    getModelForClass,
    prop,
    modelOptions,
    DocumentType,
} from "@typegoose/typegoose";
import { ObjectType, Field, ArgsType, Float } from "type-graphql";

@ObjectType()
@modelOptions({ schemaOptions: { collection: "Catalogue.SellUnity" } })
export class SellUnityBase {
    @Field({ description: "Requerido" })
    @prop({ required: true, default: false })
    public name: string;

    @Field({ description: "Requerido" })
    @prop({ required: true })
    public SATKey: string;
}

@ArgsType()
export class InputSellUnity implements Partial<SellUnityBase> {
    @Field({ description: "Requerido" })
    public name: string;

    @Field({ description: "Requerido" })
    public SATKey: string;
}

@ArgsType()
export class UpdateSellUnity extends InputSellUnity {
    @Field({ description: "Requerido" })
    public id: string;
}

@ObjectType()
export class SellUnityMain extends SellUnityBase {
    @Field({ description: "Requerido" })
    public _id: string;

    public async CreateUpdateSellUnity(
        this: DocumentType<SellUnityMain>,
        data: InputSellUnity
    ) {
        this.name = data.name;
        this.SATKey = data.SATKey;
        await this.save();
    }

    public async DeleteSellUnity(this: DocumentType<SellUnityMain>) {
        this.deleteOne({ _id: this._id });
    }
}

@ObjectType()
export class SellUnityResponse extends SellUnityBase {
    @Field()
    public id: string;
}

export const SellUnityModel =
    getModelForClass<typeof SellUnityMain>(SellUnityMain);
