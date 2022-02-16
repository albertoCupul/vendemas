import { Resolver, Query, Mutation, Arg, Args, Int } from "type-graphql";

import {
    InputInventory,
    UpdateInventory,
    InventoryMain,
    InventoryModel,
    InventoryResponse,
} from "../../../../typegoose/schemas/Products/Inventory/Inventory_schema";

import {
    InventoryResponseFix,
} from "../../../../typegoose/schemas/Products/Inventory/middleware";

@Resolver(InventoryMain)
export class InventoryResolver {

  @Query((returns) => InventoryResponse)
  async QueryInventoryById(@Arg("id") id: string): Promise<InventoryResponse> {
    const Inventory = await InventoryModel.findById(id);
    const response: InventoryResponse = InventoryResponseFix(Inventory);
    return response;
  }

    @Mutation((returns) => InventoryResponse)
    async AddInventory(
        @Args() { manage, min, quantity, width, heigth }: InputInventory
    ): Promise<InventoryResponse> {
        let Inventory = new InventoryModel();
        let response: InventoryResponse;
        await Inventory.CreateUpdateInventory({ manage, min, quantity, width, heigth });
        Inventory = await InventoryModel.findById(Inventory._id.valueOf());
        response = InventoryResponseFix(Inventory);
        return response;
    }

    @Mutation((returns) => InventoryResponse)
    async UpdateInventory(
        @Args() {id, manage, min, quantity, width, heigth }: UpdateInventory
    ): Promise<InventoryResponse> {
        let Inventory = await InventoryModel.findById(id)
        let response: InventoryResponse;
        if (Inventory){
          await Inventory.CreateUpdateInventory({ manage, min, quantity, width, heigth });
          Inventory = await InventoryModel.findById(Inventory._id.valueOf());
          response = InventoryResponseFix(Inventory);
        }else{
          response = {
            manage: false,
            min: 0,
            quantity: 0,
            width: 0,
            heigth:0,
            id:""
          }
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
  }
}
