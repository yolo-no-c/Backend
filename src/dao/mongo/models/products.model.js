import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

const { Schema } = mongoose;

const productCollection = 'product';

const productSchema = new Schema({
    code: String,
    categoria: String,
    imagen: String,
    stock: Number,
    titulo: String,
    description: String,
    precio: Number
},
    { timestamps: true }
);

productSchema.plugin(mongoosePaginate)

export const ProductModel = mongoose.model(productCollection, productSchema)