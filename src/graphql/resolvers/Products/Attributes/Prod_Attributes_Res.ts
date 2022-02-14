/* Aqui se declaran los resolvers (query and mutations) del servidor */
import { Resolver, Query, Mutation, Arg, Args, Int } from "type-graphql";

import {
  ProdAttrModel,
  ProdAttrMain,
  ProdAttrResponse,
  InputProdAttr,
  UpdateProdAttr,
} from "../../../../typegoose/schemas/Products/Attributes/prodAttributes_Schema";

import {
  ProdAttrResponseFix,
  ProdAttrArrayResponseFix,
} from "../../../../typegoose/schemas/Products/Attributes/middleware";

import { AttributeModel } from "../../../../typegoose/schemas/Catalogue/Attributes/attributeSchema";

@Resolver(ProdAttrMain)
export class ProdAttrResolver {
  @Query((returns) => [ProdAttrResponse])
  async QueryProdAttrByName(
    @Arg("name") name: string
  ): Promise<ProdAttrResponse[]> {
    const Attribute = await ProdAttrModel.find({
      name: { $regex: name, $options: "i" },
    }).populate("attributeId");

    const response: Array<ProdAttrResponse> =
      ProdAttrArrayResponseFix(Attribute);
    return response;
  }

  @Query((returns) => ProdAttrResponse)
  async QueryProdAttrById(@Arg("id") id: string): Promise<ProdAttrResponse> {
    const Attribute = await ProdAttrModel.findById(id).populate("attributeId");
    const response: ProdAttrResponse = ProdAttrResponseFix(Attribute);
    return response;
  }

  @Mutation((returns) => ProdAttrResponse)
  async AddProdAttr(
    @Args() { attributeId, value }: InputProdAttr
  ): Promise<ProdAttrResponse> {
    let Attribute = new ProdAttrModel();
    let response: ProdAttrResponse;
    let emptyRepsonse = true;
    const existAttribute = await AttributeModel.findById(attributeId);
    if (existAttribute) {
      const existProdAttr = await ProdAttrModel.findOne({ attributeId, value });
      if (!existProdAttr) {
        await Attribute.CreateUpdateProdAttr({ attributeId, value });
        Attribute = await ProdAttrModel.findById(Attribute._id.valueOf()).populate("attributeId");
        response = ProdAttrResponseFix(Attribute);
        emptyRepsonse = false;
      }
    }
    if (emptyRepsonse) {
      response = {
        attributeId: null,
        id: "",
        value: "",
      };
    }

    return response;
  }

  @Mutation((returns) => ProdAttrResponse)
  async UpdateProdAttr(
    @Args() { id, attributeId, value }: UpdateProdAttr
  ): Promise<ProdAttrResponse> {
    let response: ProdAttrResponse;
    let emptyRepsonse = true;
    let existProdAttrId = await ProdAttrModel.findById(id)
    if (existProdAttrId){
      const existAttribute = await AttributeModel.findById(attributeId);
      if (existAttribute) {
        const existProdAttr = await ProdAttrModel.findOne({ attributeId, value, _id: {$ne: id} });
        if (!existProdAttr) {
          await existProdAttrId.CreateUpdateProdAttr({ attributeId, value });
          existProdAttrId = await ProdAttrModel.findById(existProdAttrId._id.valueOf()).populate("attributeId");
          response = ProdAttrResponseFix(existProdAttrId);
          emptyRepsonse = false;
        }
      }
    }

    if (emptyRepsonse) {
      response = {
        attributeId: null,
        id: "",
        value: "",
      };
    }

    return response;
  }
 
  @Mutation((returns) => Boolean)
  async DeleteProdAttr(@Arg("id") id: string): Promise<Boolean> {
    let response: boolean = false;
    const existAttribute = await ProdAttrModel.findById(id);
    if (existAttribute) {
      await existAttribute.DeleteProdAttr();
      response = true;
    }
    return response;
  }
}
