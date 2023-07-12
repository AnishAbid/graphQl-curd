import express from 'express';
import {graphqlHTTP} from 'express-graphql';
import path from 'path';
import { fileURLToPath } from 'url';
import schema from'../graphQl/index.js';
import config from'../configs/index.js';
import Db from'../configs/db.js'
import  graphqlUploadExpress  from 'graphql-upload/graphqlUploadExpress.mjs'
Db()
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
 

app.use(express.static(path.join(__dirname, '../public')));
app.use('/photos', express.static(path.join(__dirname, '../public/photos')));
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