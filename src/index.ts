import "reflect-metadata";

import {prepareApolloServer} from './ApolloServer/asconfig'
import {connect} from 'mongoose'

import {db} from './mongoose/connection'

async function main(): Promise<void> {
  await connect(db.url, {
  user: db.userName,
  pass: db.userPwd,
})

  const ApolloServer = await prepareApolloServer()
  ApolloServer.listen(5000).then(({ url }) => {
  console.log(`ApolloServer ready at ${url}`);
})
}

try{
  main()
}catch(error){
  console.error(error)
}
