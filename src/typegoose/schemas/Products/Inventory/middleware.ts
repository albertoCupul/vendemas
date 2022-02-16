import { InventoryResponse } from "./Inventory_schema";

export function InventoryResponseFix(data) {
  let response: InventoryResponse;
  response = {
    id: data._id.valueOf(),
    manage: data.manage,
    min: data.min,
    quantity: data.quantity,
    width: data.width,
    heigth: data.heigth,
  };
  return response;
}

/*export function InventoryArrayResponseFix(data) {
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
}*/
