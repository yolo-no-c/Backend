import { Schema, model } from "mongoose"

const cartCollection = 'cart';

const cartSchema = new Schema({
    monto: Number,
    _id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    products: {
        type: [{
            product: {
                type: Schema.Types.ObjectId,
                ref: 'product'
            },
            cantidad: {
                type: Number,
                required: true,
                default: 1
            }
        }],
    }
},
    { timestamps: true });

export const cartModel = model(cartCollection, cartSchema);