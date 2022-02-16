import { ApolloServer } from "apollo-server";
import { buildSchema } from "type-graphql";

import { UserResolver } from "../graphql/resolvers/User/User_Res";
import { UsrAccResolver } from "../graphql/resolvers/User/Access_Res";
import { UserModulesResolver } from "../graphql/resolvers/User/Module_Res";
import { UserPerfilResolver } from "../graphql/resolvers/User/Perfil_Res";

import { ClientPerfilResolver } from "../graphql/resolvers/Client/Perfil_Res";
import { ClientResolver } from "../graphql/resolvers/Client/Cliente_Res";

import { LiteralResolver } from "../graphql/resolvers/Rules/Literal_Res";
import { RuleResolver } from "../graphql/resolvers/Rules/Rule_Res";

import { CategoryResolver } from "../graphql/resolvers/Products/Category/Category_Res";
import { ComplementResolver } from "../graphql/resolvers/Products/Complements/Complement_Res";
import { ProdAttrResolver } from "../graphql/resolvers/Products/Attributes/Prod_Attributes_Res";
import { ProductsResolver } from "../graphql/resolvers/Products/Product/Product";

import { AttributeResolver } from "../graphql/resolvers/Attributes/Attributes_Res";
import { SellUnityResolver } from "../graphql/resolvers/Products/SellUnity/SellUnity_Res";
import { InventoryResolver } from "../graphql/resolvers/Products/Inventory/Inventory_Res";

export async function prepareApolloServer(): Promise<ApolloServer> {
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [
                UserResolver,
                LiteralResolver,
                RuleResolver,
                UsrAccResolver,
                UserModulesResolver,
                UserPerfilResolver,
                ClientPerfilResolver,
                ClientResolver,
                CategoryResolver,
                ComplementResolver,
                AttributeResolver,
                ProdAttrResolver,
                ProductsResolver,
                SellUnityResolver,
                InventoryResolver
            ],
        }),
    });
    return apolloServer;
}
