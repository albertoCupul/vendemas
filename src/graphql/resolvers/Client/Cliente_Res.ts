import { Resolver, Query, Mutation, Arg, Args, Int } from "type-graphql";
import { DocumentType } from "@typegoose/typegoose";

import {
  ClientModel,
  InputClient,
  UpdateClient,
  ClientResponse,
  ClientMain,
} from "../../../typegoose/schemas/Client/clienteSchema";

import { PerfilModel } from "../../../typegoose/schemas/Client/clPerfilSchema";

import {
  PerfilResponseFix,
  ClientResponseFix,
  ClientArrayResponseFix,
} from "../../../typegoose/schemas/Client/middleware";

import { ClienteGeneral } from "../../../DefaultSettings/defaultValues";

@Resolver(ClientResolver)
export class ClientResolver {
  @Query((returns) => ClientResponse)
  async QueryClientById(@Arg("id") id: string): Promise<ClientResponse> {
    let response: ClientResponse;
    const client = await ClientModel.findById(id).populate("idPerfil").exec();
    response = await ClientResponseFix(client);
    return response;
  }

  @Query((returns) => [ClientResponse])
  async QueryClientByName(
    @Arg("name") name: string
  ): Promise<ClientResponse[]> {
    let response: Array<ClientResponse>;
    const client = await ClientModel.find({
      fullName: { $regex: name, $options: "i" },
    })
      .populate("idPerfil")
      .exec();
    response = await ClientArrayResponseFix(client);
    return response;
  }

  @Mutation((returns) => ClientResponse)
  async AddClient(
    @Args()
    {
      name,
      first,
      second,
      address,
      references,
      phone,
      rfc,
      credit,
      PerfilID,
    }: InputClient
  ): Promise<ClientResponse> {
    let response: ClientResponse;
    let client = new ClientModel();
    const perfil = await PerfilModel.findById(PerfilID).exec();
    if (perfil) {
      await client.CreateAndUpdateClient({
        name,
        first,
        second,
        address,
        references,
        phone,
        rfc,
        credit,
        perfil,
      });
      client = await ClientModel.findById(client._id.valueOf()).populate(
        "idPerfil"
      );
      response = await ClientResponseFix(client);
    }
    return response;
  }

  @Mutation((returns) => ClientResponse)
  async UpdateClient(
    @Args()
    {
      id,
      name,
      first,
      second,
      address,
      references,
      phone,
      rfc,
      credit,
      PerfilID,
    }: UpdateClient
  ): Promise<ClientResponse> {
    let response: ClientResponse;
    let client = await ClientModel.findById(id).exec();
    const perfil = await PerfilModel.findById(PerfilID).exec();
    if (perfil) {
      await client.CreateAndUpdateClient({
        name,
        first,
        second,
        address,
        references,
        phone,
        rfc,
        credit,
        perfil,
      });
      client = await ClientModel.findById(client._id.valueOf()).populate(
        "idPerfil"
      );
      response = await ClientResponseFix(client);
    }
    return response;
  }

  @Mutation((returns) => Boolean)
  async DeleteClient(@Arg("id") id: string): Promise<Boolean> {
    let response: boolean = false;
    const client = await ClientModel.findByIdAndDelete(id).exec();
    if (client) response = true;
    return response;
  }

  @Mutation((returns) => Boolean)
  async wz7_AddClienteGeneral(): Promise<Boolean> {
    const client = new ClientModel();
    let response: boolean = false;
    let name: string,
      first: string,
      second: string,
      address: string,
      references: string,
      phone: string,
      rfc: string,
      credit: number;
    const perfil = await PerfilModel.findOne({
      name: ClienteGeneral.perfilName,
    }).exec();
    if (perfil) {
      name = ClienteGeneral.name;
      const existClient = await ClientModel.findOne({ name });
      if (!existClient) {
        first = ClienteGeneral.first;
        second = ClienteGeneral.second;
        address = ClienteGeneral.address;
        references = ClienteGeneral.references;
        phone = ClienteGeneral.phone;
        rfc = ClienteGeneral.rfc;
        credit = ClienteGeneral.credit;

        const client = new ClientModel();
        client.CreateAndUpdateClient({
          name,
          first,
          second,
          address,
          references,
          phone,
          rfc,
          credit,
          perfil,
        });
      }
      response = true;
    }
    return response;
  }
}
