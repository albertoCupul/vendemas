/* Aqui se declaran los resolvers (query and mutations) del servidor */
import { Resolver, Query, Mutation, Arg, Args, Int } from "type-graphql";

import {
  AttributeModel,
  AttributeMain,
  AttributeResponse,
  InputAttribute,
  UpdateAttribute,
} from "../../../typegoose/schemas/Catalogue/Attributes/attributeSchema";

import {
  AttributeResponseFix,
  AttributeArrayResponseFix,
} from "../../../typegoose/schemas/Catalogue/Attributes/middleware";

@Resolver(AttributeMain)
export class AttributeResolver {
  @Query((returns) => [AttributeResponse])
  async QueryAttributeByName(
    @Arg("name") name: string
  ): Promise<AttributeResponse[]> {
    const Attribute = await AttributeModel.find({
      name: { $regex: name, $options: "i" },
    });
    
    const response: Array<AttributeResponse> =
      AttributeArrayResponseFix(Attribute);
    return response;
  }

  @Query((returns) => AttributeResponse)
  async QueryAttributeById(@Arg("id") id: string): Promise<AttributeResponse> {
    const Attribute = await AttributeModel.findById(id);
    const response: AttributeResponse = AttributeResponseFix(Attribute);
    return response;
  }

  @Mutation((returns) => AttributeResponse)
  async AddAttribute(
    @Args() { name  }: InputAttribute
  ): Promise<AttributeResponse> {
    let Attribute = new AttributeModel();
    let response: AttributeResponse;
    const existAttribute = await AttributeModel.findOne({ name });
    if (!existAttribute) {
      await Attribute.CreateUpdateAttribute( name );
      Attribute = await AttributeModel.findById(Attribute._id.valueOf());
      response = AttributeResponseFix(Attribute);
    } else {
      response = {
        name: "",
        id: "",
      };
    }
    return response;
  }

  @Mutation((returns) => AttributeResponse)
  async UpdateAttribute(
    @Args() { id, name }: UpdateAttribute
  ): Promise<AttributeResponse> {
    let response: AttributeResponse;
    const existAttribute = await AttributeModel.findById(id);
    if (existAttribute) {
      await existAttribute.CreateUpdateAttribute( name );
      response = AttributeResponseFix(existAttribute);
    } else {
      response = {
        name: "",
        id: "",
      };
    }
    return response;
  }

  @Mutation((returns) => Boolean)
  async DeleteAttribute(@Arg("id") id: string): Promise<Boolean> {
    let response: boolean = false;
    const existAttribute = await AttributeModel.findById(id);
    if (existAttribute) {
      await existAttribute.DeleteAttribute();
      response = true;
    }
    return response;
  }

}
