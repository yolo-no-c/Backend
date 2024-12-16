import fs from "fs";

export default class CartManager {
    constructor(path) {
      this.path = path;
      this.carts = [];
    }

}