/* Aqui se declaran los resolvers (query and mutations) del servidor */
import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Args
} from "type-graphql";
import { DocumentType } from "@typegoose/typegoose";

import {
  RuleModel,
  RuleMain,
  InputRule,
  UpdateRule,
  RuleResponse,
} from "../../../typegoose/schemas/Rules/RuleSchema";
import {
  LiteralModel,
  LiteralMain,
} from "../../../typegoose/schemas/Rules/LiteralSchema";
import {
  RuleResponseFix,
  RuleArrayResponseFix,
  RuleExistInDB,
  LiteralExistInRule,
  LiteralExistInDB,
} from "../../../typegoose/schemas/Rules/middleware";

@Resolver(RuleMain)
export class RuleResolver {
  @Query((returns) => [RuleResponse])
  async QueryRuleByName(@Arg("name") name: string): Promise<RuleResponse[]> {
    const rules: DocumentType<RuleMain>[] = await RuleModel.find()
      .findByNamePopulate(name)
      .orFail()
      .exec();
    const response = RuleArrayResponseFix(rules);
    return response;
  }

  @Query((returns) => RuleResponse)
  async QueryRuleById(@Arg("id") id: string): Promise<RuleResponse> {
    const rule = await RuleModel.findById(id).populate("idLiteral").exec();
    const response = RuleResponseFix(rule);
    return response;
  }

  @Query((returns) => Boolean)
  async QueryLiteralExistInRule(@Arg("id") id: string): Promise<Boolean> {
    const response: boolean = await LiteralExistInRule(id);
    return response;
  }

  @Mutation((returns) => RuleResponse)
  async AddRule(
    @Args() { name, literal, arrayOperators }: InputRule
  ): Promise<RuleResponse> {
    let rule = new RuleModel();
    await rule.CreateUpdateRule({ name, literal, arrayOperators });
    const id = rule._id.valueOf();
    const data = await RuleModel.findById(id).populate("idLiteral").exec();
    const response = RuleResponseFix(data);
    return response;
  }

  @Mutation((returns) => RuleResponse)
  async UpdateRule(
    @Args() { id, name, literal, arrayOperators }: UpdateRule
  ): Promise<RuleResponse> {
    await RuleModel.update(
      { _id: id },
      { $set: { idLiteral: [] } },
      { multi: true }
    );
    const rule = await RuleModel.findById(id).exec();
    await rule.CreateUpdateRule({ name, literal, arrayOperators });
    const data = await RuleModel.findById(id).populate("idLiteral").exec();
    const response = RuleResponseFix(data);
    return response;
  }

  @Mutation((returns) => Boolean)
  async DeleteRule(@Arg("id") id: string): Promise<Boolean> {
    const rule = await RuleModel.deleteOne({ _id: id });
    if (rule.deletedCount > 0) return true;
    return false;
  }

  @Mutation((returns) => Boolean)
  async wz5_addRuleGeneral(): Promise<Boolean> {
    try {
      const name: string = "General";
      const existRule = await RuleExistInDB(name)
      if (!existRule){
        const literal = await searchIdLiterals();
        const rule = new RuleModel();      
        const arrayOperators: Array<string> = [];
        await rule.CreateUpdateRule({ name, literal, arrayOperators });
      }
      return true;
    } catch (error) {
      return false;
    }
  }

}

async function searchIdLiterals(): Promise<string[]> {
  try {
    const literals = await LiteralModel.find({name:"Precio Venta"});
    const arrayString = literals.map((data) => {
      return data._id.valueOf();
    });
    return arrayString;
  } catch (error) {
    return error;
  }
}
