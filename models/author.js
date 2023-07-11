import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const authorSchema = new Schema({

   name: String,

   age: Number

});

export const Author = mongoose.model('Author', authorSchema);