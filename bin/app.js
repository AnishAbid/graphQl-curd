const express = require('express');
const {graphqlHTTP} = require('express-graphql');
const schema = require('../graphQl/index')
const config = require('../configs')
const Db = require('../configs/db')()
const app = express();

 
//This route will be used as an endpoint to interact with Graphql,
//All queries will go through this route.
 
app.use('/graphql', graphqlHTTP({
 
   //directing express-graphql to use this schema to map out the graph
 
   schema,
 
   //directing express-graphql to use graphiql when goto '/graphql' address in the browser
 
   //which provides an interface to make GraphQl queries
 
   graphiql:true
 
}));
 

 
 
app.listen(config.PORT, () => {
 
   console.log(`Listening on port ${config.PORT}`);
 
});