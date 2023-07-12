import express from 'express';
import {graphqlHTTP} from 'express-graphql';
import schema from'../graphQl/index.js';
import config from'../configs/index.js';
import Db from'../configs/db.js'
Db()
import  graphqlUploadExpress  from 'graphql-upload/graphqlUploadExpress.mjs'
const app = express();

 
//This route will be used as an endpoint to interact with Graphql,
//All queries will go through this route.
 
app.use('/graphql',graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }), graphqlHTTP({
 
   //directing express-graphql to use this schema to map out the graph
 
   schema,
 
   //directing express-graphql to use graphiql when goto '/graphql' address in the browser
 
   //which provides an interface to make GraphQl queries
 
   graphiql:true
 
}));
 

 
 
app.listen(config.PORT, () => {
 
   console.log(`Listening on port ${config.PORT}`);
 
});