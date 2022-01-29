/* Aqui se declaran los resolvers (query and mutations) del servidor */
import { Resolver, Query, Mutation, Arg, Args, Int } from "type-graphql";

import {
  ComplementModel,
  ComplementMain,
  ComplementResponse,
  InputComplement,
  UpdateComplement,
} from "../../../../typegoose/schemas/Products/Complement/complementSchema";

import {
  ComplementResponseFix,
  ComplementArrayResponseFix,
} from "../../../../typegoose/schemas/Products/Complement/middleware";

@Resolver(ComplementMain)
export class ComplementResolver {
  @Query((returns) => [ComplementResponse])
  async QueryComplementByName(
    @Arg("name") name: string
  ): Promise<ComplementResponse[]> {
    const Complement = await ComplementModel.find({
      name: { $regex: name, $options: "i" },
    });

    const response: Array<ComplementResponse> =
      ComplementArrayResponseFix(Complement);
    return response;
  }

  @Query((returns) => ComplementResponse)
  async QueryComplementById(@Arg("id") id: string): Promise<ComplementResponse> {
    const Complement = await ComplementModel.findById(id);
    const response: ComplementResponse = ComplementResponseFix(Complement);
    return response;
  }

  @Mutation((returns) => ComplementResponse)
  async AddComplement(
    @Args() { name, precio }: InputComplement
  ): Promise<ComplementResponse> {
    let Complement = new ComplementModel();
    let response: ComplementResponse;
    const existComplement = await ComplementModel.findOne({ name });
    if (!existComplement) {
      await Complement.CreateUpdateComplement({ name, precio });
      Complement = await ComplementModel.findById(Complement._id.valueOf());
      response = ComplementResponseFix(Complement);
    } else {
      response = {
        name: "",
        precio: 0.00,
        id: "",
      };
    }
    return response;
  }

  @Mutation((returns) => ComplementResponse)
  async UpdateComplement(
    @Args() { id, name, precio }: UpdateComplement
  ): Promise<ComplementResponse> {
    let response: ComplementResponse;
    const existComplement = await ComplementModel.findById(id);
    if (existComplement) {
      await existComplement.CreateUpdateComplement({ name, precio });
      response = ComplementResponseFix(existComplement);
    } else {
      response = {
        name: "",
        precio: 0.00,
        id: "",
      };
    }
    return response;
  }

  @Mutation((returns) => Boolean)
  async DeleteComplement(@Arg("id") id: string): Promise<Boolean> {
    let response: boolean = false;
    const existComplement = await ComplementModel.findById(id);
    if (existComplement) {
      await existComplement.DeleteComplement();
      response = true;
    }
    return response;
  }

  /*@Mutation((returns) => Boolean)
  async wz8_AddComplementMain(): Promise<Boolean> {
    try {
      let Complement = new ComplementModel();
      const name = ComplementMain;
      const existComplement = await ComplementModel.findOne({ name });
      if (!existComplement) {
        const editable = false;
        await Complement.CreateUpdateComplement({ name, editable });
      }
      return true;
    } catch (error) {
      return false;
    }
  }*/
}
