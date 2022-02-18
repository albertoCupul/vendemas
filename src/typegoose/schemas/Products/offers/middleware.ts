import { OffersMain, OffersResponse } from "./offers_schema";

export function OffersResponseFix(data) {
  let response: OffersResponse;
  response = {
    id: data._id.valueOf(),
    name: data.name,
    quantity: data.quantity,
    giftQuantity: data.giftQuantity,
    newPrice: data.newPrice,
    startDate: data.startDate,
    endDate: data.endDate,
    daysDuration: data.daysDuration
  };
  return response;
}

export async function OffersArrayResponseFix(data) {
  let PromiseArray : Array<OffersResponse> = []
  PromiseArray = data.map(registro => {
    const Offer: OffersResponse  = {
      name: registro.name,
      quantity: registro.quantity,
      giftQuantity: registro.giftQuantity,
      startDate: registro.startDate,
      endDate: registro.endDate,
      daysDuration: registro.daysDuration,
      id: registro.id,
      newPrice: registro.newPrice
    }
    return Offer
  })
  return PromiseArray
}
