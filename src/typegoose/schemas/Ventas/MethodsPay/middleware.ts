import { MethodsPayResponse, MethodsPayModel } from "./MethodsPay_schema";

export function MethodsPayResponseFix(data) {
    let response: MethodsPayResponse;
    response = {
        name: data.name,
        id: data._id.valueOf(),
        SATKey: data.SATKey,
    };
    return response;
}

export function MethodsPayArrayResponseFix(data) {
    const arrayMethodsPay: Array<MethodsPayResponse> = [];
    data.forEach((elemento) => {
        arrayMethodsPay.push({
            name: elemento.name,
            id: elemento._id.valueOf(),
            SATKey: elemento.SATKey,
        });
    });
    return arrayMethodsPay;
}
