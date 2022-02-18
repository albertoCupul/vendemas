import {
    getModelForClass,
    prop,
    modelOptions,
    DocumentType,
} from "@typegoose/typegoose";
import { ObjectType, Field, ArgsType, Float } from "type-graphql";

@ObjectType()
@modelOptions({ schemaOptions: { collection: "Catalogue.MethodsPay" } })
export class MethodsPayBase {
    @Field({ description: "Requerido" })
    @prop({ required: true, default: false })
    public name: string;

    @Field({ description: "Requerido" })
    @prop({ required: true })
    public SATKey: string;
}

@ArgsType()
export class InputMethodsPay implements Partial<MethodsPayBase> {
    @Field({ description: "Requerido" })
    public name: string;

    @Field({ description: "Requerido" })
    public SATKey: string;
}

@ArgsType()
export class UpdateMethodsPay extends InputMethodsPay {
    @Field({ description: "Requerido" })
    public id: string;
}

@ObjectType()
export class MethodsPayMain extends MethodsPayBase {
    @Field({ description: "Requerido" })
    public _id: string;

    public async CreateUpdateMethodsPay(
        this: DocumentType<MethodsPayMain>,
        data: InputMethodsPay
    ) {
        this.name = data.name;
        this.SATKey = data.SATKey;
        await this.save();
    }

    public async DeleteMethodsPay(this: DocumentType<MethodsPayMain>) {
        this.deleteOne({ _id: this._id });
    }
}

@ObjectType()
export class MethodsPayResponse extends MethodsPayBase {
    @Field()
    public id: string;
}

export const MethodsPayModel =
    getModelForClass<typeof MethodsPayMain>(MethodsPayMain);
