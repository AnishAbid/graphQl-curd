import graphql from 'graphql';
import {Book} from '../models/book.js';
import {Author} from '../models/author.js';
import fs from 'fs'
import  GraphQLUpload  from 'graphql-upload/GraphQLUpload.mjs'


const {
   GraphQLObjectType, GraphQLString,
   GraphQLID, GraphQLInt,GraphQLSchema,
   GraphQLList,GraphQLNonNull,GraphQLScalarType,GraphQLObject
} = graphql;

const storeFS = ({ stream, filename }) => {
    const uploadDir = './public/photos';
    const path = `${uploadDir}/${filename}`;
    return new Promise((resolve, reject) =>
        stream
            .on('error', error => {
                if (stream.truncated)
                    // delete the truncated file
                    fs.unlinkSync(path);
                reject(error);
            })
            .pipe(fs.createWriteStream(path))
            .on('error', error => reject(error))
            .on('finish', () => resolve({ path }))
    );
}

//Schema defines data on the Graph like object types(book type), relation between
//these object types and describes how it can reach into the graph to interact with
//the data to retrieve or mutate the data  



const BookType = new GraphQLObjectType({
   name: 'Book',
   //We are wrapping fields in the function as we dont want to execute this ultil
   //everything is inilized. For example below code will throw an error AuthorType not
   //found if not wrapped in a function
   fields: () => ({
       id: { type: GraphQLID  },
       name: { type: GraphQLString },
       pages: { type: GraphQLInt },
       author: {
       type: AuthorType,
       resolve(parent, args) {
           return Author.findById(parent.authorID);
       }
   }
   })
});



const AuthorType = new GraphQLObjectType({
   name: 'Author',
   fields: () => ({
       id: { type: GraphQLID },
       name: { type: GraphQLString },
       age: { type: GraphQLInt },
       book:{
           type: new GraphQLList(BookType),
           resolve(parent,args){
               return Book.find({ authorID: parent.id });
           }
       }
   })
})
const FileType = new GraphQLObjectType({
    name: 'File',
    //We are wrapping fields in the function as we dont want to execute this ultil
    //everything is inilized. For example below code will throw an error AuthorType not
    //found if not wrapped in a function
    fields: () => ({
        fileLocation: { type: GraphQLString  },
        description: { type: GraphQLString },
        tags: { type: GraphQLString },
        
    })
 });


//RootQuery describe how users can use the graph and grab data.
//E.g Root query to get all authors, get all books, get a particular
//book or get a particular author.
const RootQuery = new GraphQLObjectType({
   name: 'RootQueryType',
   fields: {
       book: {
           type: BookType,
           //argument passed by the user while making the query
           args: { id: { type: GraphQLID } },
           resolve(parent, args) {
               //Here we define how to get data from database source



               //this will return the book with id passed in argument
               //by the user
               return Book.findById(args.id);
           }
       },
       books:{
           type: new GraphQLList(BookType),
           resolve(parent, args) {
               return Book.find({});
           }
       },
       author:{
           type: AuthorType,
           args: { id: { type: GraphQLID } },
           resolve(parent, args) {
               return Author.findById(args.id);
           }
       },
       authors:{
           type: new GraphQLList(AuthorType),
           resolve(parent, args) {
               return Author.find({});
           }
       }
   }
});


//Very similar to RootQuery helps users to add/update to the database.
const Mutation = new GraphQLObjectType({
   name: 'Mutation',
   fields: {
       addAuthor: {
           type: AuthorType,
           args: {
               //GraphQLNonNull make these fields required
               name: { type: new GraphQLNonNull(GraphQLString) },
               age: { type: new GraphQLNonNull(GraphQLInt) }
           },
           resolve(parent, args) {
               let author = new Author({
                   name: args.name,
                   age: args.age
               });
               return author.save();
           }
       },
       addBook:{
           type:BookType,
           args:{
               name: { type: new GraphQLNonNull(GraphQLString)},
               pages: { type: new GraphQLNonNull(GraphQLInt)},
               authorID: { type: new GraphQLNonNull(GraphQLID)}
           },
           resolve(parent,args){
               let book = new Book({
                   name:args.name,
                   pages:args.pages,
                   authorID:args.authorID
               })
               return book.save()
           }
       },
       /*
       Postman send file example 
       Datatype: form-data
       key: operations
       value: {"query":"mutation addPhoto($file:Upload!) {addPhoto(file: $file,description:\"ATR\",tags:\"KTDO\"){fileLocation,description,tags}}"}
       key: map
       value: {"0": ["variables.file"]}
       key: 0
       value: file
       */
       addPhoto: {
        type:  FileType,
        args:{
            file: {type:GraphQLUpload},
            description: { type: new GraphQLNonNull(GraphQLString)},
            tags: { type: new GraphQLNonNull(GraphQLString)}
        },
        async resolve(parent,args){
            const { description, tags } = args;
            const { filename, mimetype, createReadStream } = await args.file;
        const stream = createReadStream();
        const pathObj = await storeFS({ stream, filename });
        const fileLocation = pathObj.path;
        const photo = {
            fileLocation,
            description,
            tags
        }
        return photo;
        }
    }
   }
});



//Creating a new GraphQL Schema, with options query which defines query
//we will allow users to use when they are making requests.
const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
 });
export default schema