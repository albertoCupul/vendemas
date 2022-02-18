import { Resolver, Query, Mutation, Arg, Args, Int } from "type-graphql";

import {
    InputOffers,
    UpdateOffers,
    OffersMain,
    OffersModel,
    OffersResponse,
} from "../../../../typegoose/schemas/Products/offers/offers_schema";

import { OffersArrayResponseFix, OffersResponseFix } from "../../../../typegoose/schemas/Products/offers/middleware";

@Resolver(OffersMain)
export class OffersResolver {

  @Query((returns) => [OffersResponse])
  async QueryOffersByName(@Arg("name") name: string): Promise<OffersResponse[]> {
    const Offers = await OffersModel.find({name: { $regex: name, $options: "i" }})
    const response : Array<OffersResponse> = await OffersArrayResponseFix(Offers);
    return response
  }

  @Query((returns) => OffersResponse)
  async QueryOffersById(@Arg("id") id: string): Promise<OffersResponse> {
    const Offers = await OffersModel.findById(id);
    const response: OffersResponse = OffersResponseFix(Offers);
    return response;
  }

    @Mutation((returns) => OffersResponse)
    async AddOffers(@Args() data: InputOffers): Promise<OffersResponse> {
        let Offers = new OffersModel();
        let response: OffersResponse;
        await Offers.CreateUpdateOffers(data);
        Offers = await OffersModel.findById(Offers._id.valueOf());
        response = OffersResponseFix(Offers);
        return response;
    }

    @Mutation((returns) => OffersResponse)
    async UpdateOffers(@Args() data: UpdateOffers): Promise<OffersResponse> {
        let response: OffersResponse;
        let Offers = await OffersModel.findById(data.id);
        if (Offers) {
            await Offers.CreateUpdateOffers(data);
            Offers = await OffersModel.findById(Offers._id.valueOf());
            response = OffersResponseFix(Offers);
        } else {
            response = {
                id: "",
                name: "",
                quantity: 0,
                giftQuantity: 0,
                newPrice: 0,
                startDate: null,
                endDate: null,
                daysDuration: 0,
            };
        }
        return response;
    }
   
  @Mutation((returns) => Boolean)
  async DeleteOffers(@Arg("id") id: string): Promise<Boolean> {
    let response: boolean = false;
    const existOffers = await OffersModel.findById(id);
    if (existOffers) {
      await existOffers.DeleteOffers();
      response = true;
    }
    return response;
  }
}
