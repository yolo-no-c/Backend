import  fs from "node:fs";
import ProductsManager from "../class/productManager.js";
import { __dirname } from "../utils.js";

const productManager = new ProductsManager(__dirname + "/data/products.json");

class CartsManager {
    constructor(path) {
        this.path = path;
        this.cartList = [];
    }

    async getAllCarts() {
        const list = await fs.promises.readFile(this.path, "utf-8");
        this.cartList = JSON.parse(list),carts || [];
        return [...this.cartList];
    }

    async addCart() {
        const nuevoId = await this.getNextCartId();
        const nuevoCart = { id: nuevoId, products: [] };
        this.cartList.push(nuevoCart);
        await this.saveCarts();
        return nuevoId;
    }

    async getCart(id) {
        await this.getAllCarts();
        const cart = this.cartList.find((cart) => cart.id === id);
        if (cart) {
            return cart;
        } else {
            throw new Error("No se encontro el ID pa :(");
        }
    }

    // Se agregan productos al carrito:
    async addProductToCart(cid, pid) {
        //Obtener lista de productos y carritos pa:
        const productsList = await productManager.getAllProducts();
        const cartsList = await this.getAllCarts();
        //Verificamos si el producto y el cart existen buscandolos por su ID:
        if (productsList.some((obj) => obj.id == pid)) {
            if (cartsList.some((obj) => obj.id == cid)) {
                const prod = productsList.find((obj) => obj.id == pid);
                const cartIndex = cartsList.findIndex((obj) => obj.id == cid);
                const cart = cartsList[cartIndex];

                //Verificamos si el producto ya esta en el carrito
                const productIndex = cart.products.findIndex((p) => p.id == pid);
                if (productIndex !== -1) {
                    //Si existe incrementamos la cantidad:
                    cart.products[productIndex].quantity++;
                } else {
                    //Si no existe lo agregamos al carrito:
                    cart.products.push({ id: prod.id, quantity: 1 });
                }

                //Actualizar el carrito en this.cartList:
                this.cartList[cartIndex] = cart;

                //Guardar los cambios en el archivo:
                await this.saveCarts();
                
                console.log("Producto agregado al carrito");
            } else {
                console.log("No existe el ID del carrito");
            }
        } else {
            console.log("No existe el ID del producto");
        }
    }

    //Aqui se generan los ids para los carritos
    async getNextCartId() {
        await this.getAllCarts();//Obtener los carritos existentes
        const maxId = this.cartList.reduce(
            (max, cart) => (cart.id > max ? cart.id : max),
            0
        );//Obtube el maximo id actual. Si this.cartList esta vacio,"maxId se establece en 0"
        return maxId + 1; //Devolver el siguiente id disponible
    }

    // Funcion poara guardar la lista actualizada de carritos (this.cartList) en el archivo carts.json
    async saveCarts() {
        try {
            //Escribe el archivo en la ruta especificada:
            await fs.promises.writeFile(
                this.path,
                JSON.stringify({ carts: this.cartList })
            );
            console.log("Carritos guardados");
        } catch (error) {
            console.log("Error al guardar los carritos", error);
        }
    }
}

export default CartsManager;