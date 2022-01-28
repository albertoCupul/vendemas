/* Aqui se declaran los resolvers (query and mutations) del servidor */
import { Resolver, Query, Mutation, Arg, Args, Int } from "type-graphql";
import { DocumentType } from "@typegoose/typegoose";

import { ObjectId } from "mongoose";

import { objectLiterals } from "../../../DefaultSettings/defaultValues";

import {
  LiteralModel,
  LiteralMain,
  InputLiteral,
  UpdateLiteral,
  LiteralResult,
} from "../../../typegoose/schemas/Rules/LiteralSchema";
import {
  LiteralArrayResponseFix,
  literalResponseFix,
  LiteralExistInRule,
  LiteralExistInDB,
} from "../../../typegoose/schemas/Rules/middleware";

@Resolver(LiteralMain)
export class LiteralResolver {
  @Query((returns) => [LiteralResult])
  async QueryLiteralByName(
    @Arg("name") name: string
  ): Promise<LiteralResult[]> {
    const literals: DocumentType<LiteralMain>[] =
      await LiteralModel.find().findByName(name);
    const response = LiteralArrayResponseFix(literals);
    return response;
  }

  @Query((returns) => LiteralResult)
  async QueryLiteralById(@Arg("id") id: string): Promise<LiteralResult> {
    const literals: DocumentType<LiteralMain> = await LiteralModel.findById(id);
    const response = literalResponseFix(literals);
    return response;
  }

  @Mutation((returns) => LiteralResult)
  async AddLiteral(
    @Args() { name, value, editable }: InputLiteral
  ): Promise<LiteralResult> {
    const literal = new LiteralModel();
    await literal.CreateUpdateLiteral({ name, value, editable });
    const response: LiteralResult = literalResponseFix(literal);
    return response;
  }

  @Mutation((returns) => LiteralResult)
  async UpdateLiteral(
    @Args() { id, name, value, editable }: UpdateLiteral
  ): Promise<LiteralResult> {
    const literal = await LiteralModel.findById(id).exec();
    let response: LiteralResult;
    editable = literal.editable;
    if (literal.editable) {
      await literal.CreateUpdateLiteral({ name, value, editable });
      response = literalResponseFix(literal);
    }
    return response;
  }

  @Mutation((returns) => Boolean)
  async DeleteLiteral(@Arg("id") id: string): Promise<Boolean> {
    let response: boolean = false;
    const isInUse = await LiteralExistInRule(id);
    if (!isInUse) {
      const literal = await LiteralModel.findById(id);
      await literal.DeleteLiteral();
      response = true;
    }
    return response;
  }

  @Mutation((returns) => Boolean)
  async wz4_createLiteralList(): Promise<Boolean> {
    try {
      await objectLiterals.forEach(async (obj) => {
        let response: boolean = false;
        const literal = new LiteralModel();
        let name: string = obj.name;
        const value: number = obj.value;
        const editable: boolean = obj.editable;
        const existInDB = await LiteralExistInDB(name);
        if (!existInDB) {
          await literal.CreateUpdateLiteral({ name, value, editable });
        }
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
