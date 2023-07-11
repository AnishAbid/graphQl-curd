import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const bookSchema = new Schema({

   name: String,

   pages: Number,

   authorID: String

});

export const Book = mongoose.model('Book', bookSchema);