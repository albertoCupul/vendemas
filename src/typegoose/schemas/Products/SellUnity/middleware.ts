import { SellUnityResponse, SellUnityModel } from "./SellUnity_schema";

export function SellUnityResponseFix(data) {
    let response: SellUnityResponse;
    response = {
        name: data.name,
        id: data._id.valueOf(),
        SATKey: data.SATKey,
    };
    return response;
}

export function SellUnityArrayResponseFix(data) {
    const arraySellUnity: Array<SellUnityResponse> = [];
    data.forEach((elemento) => {
        arraySellUnity.push({
            name: elemento.name,
            id: elemento._id.valueOf(),
            SATKey: elemento.SATKey,
        });
    });
    return arraySellUnity;
}
