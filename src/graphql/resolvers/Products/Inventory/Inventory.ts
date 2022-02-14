import { Resolver, Query, Mutation, Arg, Args, Int } from "type-graphql";

import {
    InputInventory,
    UpdateInventory,
    InventoryMain,
    InventoryModel,
    InventoryResponse
} from "../../../../typegoose/schemas/Products/Inventory/Inventory";

import {
    InventoryArrayResponseFix,
    InventoryResponseFix,
} from "../../../../typegoose/schemas/Products/Inventory/middleware";

@Resolver(InventoryMain)
export class InventoryResolver {
    /*@Query((returns) => [InventoryResponse])
  async QueryInventoryByName(
    @Arg("name") name: string
  ): Promise<InventoryResponse[]> {
    const Inventory = await InventoryModel.find({
      name: { $regex: name, $options: "i" },
    });

    const response: Array<InventoryResponse> =
      InventoryArrayResponseFix(Inventory);
    return response;
  }

  @Query((returns) => InventoryResponse)
  async QueryInventoryById(@Arg("id") id: string): Promise<InventoryResponse> {
    const Inventory = await InventoryModel.findById(id);
    const response: InventoryResponse = InventoryResponseFix(Inventory);
    return response;
  }*/

    @Mutation((returns) => InventoryResponse)
    async AddInventory(
        @Args() { manage, quantity, width, heigth }: InputInventory
    ): Promise<InventoryResponse> {
        let Inventory = new InventoryModel();
        let response: InventoryResponse;
        const existInventory = await InventoryModel.findOne({ name });
        if (!existInventory) {
            await Inventory.CreateUpdateInventory({ name, precio });
            Inventory = await InventoryModel.findById(
                Inventory._id.valueOf()
            );
            response = InventoryResponseFix(Inventory);
        } else {
            response = {
                name: "",
                precio: 0.0,
                id: "",
            };
        }
        return response;
    }

    /*@Mutation((returns) => InventoryResponse)
  async UpdateInventory(
    @Args() { id, name, precio }: UpdateInventory
  ): Promise<InventoryResponse> {
    let response: InventoryResponse;
    const existInventory = await InventoryModel.findById(id);
    if (existInventory) {
      await existInventory.CreateUpdateInventory({ name, precio });
      response = InventoryResponseFix(existInventory);
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
  async DeleteInventory(@Arg("id") id: string): Promise<Boolean> {
    let response: boolean = false;
    const existInventory = await InventoryModel.findById(id);
    if (existInventory) {
      await existInventory.DeleteInventory();
      response = true;
    }
    return response;
  }*/
}
