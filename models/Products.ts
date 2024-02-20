import mongoose, { Schema } from "mongoose";
import { IAudit } from "../interfaces/shared.interface";

export interface IProduct extends IAudit {
  name: string;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true, maxlength: 40 },
  createdAt: {
    type: Number,
    default: new Date().getTime(),
  },
  createdBy: {
    //createdBy -> from the token
    type: String,
    default: "",
  },
  updatedAt: {
    type: Number,
    default: null,
  },
  updatedBy: {
    //updatedBy -> from the token
    type: String,
    default: null,
  },
  deletedAt: {
    type: Number,
    default: null,
  },
  deletedBy: {
    //updatedBy -> from the token
    type: String,
    default: null,
  },
});

const Product = mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
