import { InventoryResponse } from "./Inventory";

export function InventoryResponseFix(data) {
  //const data = rule.toObject()
  let response: InventoryResponse;
  response = {
    //attributeId : data.attributeId,
    id: data._id.valueOf(),
    manage: data.manage,
    quantity: data.quantity,
    width: data.width,
    heigth: data.heigth,
  };
  return response;
}

export function InventoryArrayResponseFix(data) {
  const arrayInventory: Array<InventoryResponse> = [];
  data.forEach((elemento) => {
    arrayInventory.push({
      id: data._id.valueOf(),
      manage: data.manage,
      quantity: data.quantity,
      width: data.width,
      heigth: data.heigth,
    });
  });
  return arrayInventory;
}
