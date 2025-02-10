import { Router } from "express";
import { cartModel } from "../dao/mongo/models/cart.model.js";
import { ProductModel } from "../dao/mongo/models/products.model.js";

const router = Router();

router.get('/', async (req, res) => {
    const response = await fetch(`http://localhost:8080/api/carts/679e786229c5021d6084e788`)
    const cart = await response.json()
    res.render('cart', {
        css: 'carts',
        cart: cart
    })
})

// Obtener el carrito por su ID
router.get('/:cid', async (req, res) => {
    // Buscamos el carrito por su ID y hacemos un populate para obtener los productos
    const response = await cartModel.find().populate('products.product');
    res.json({ response });
});

// Actualizar el carrito (agregar o modificar productos)
router.put('/:cid', async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body;
    const { product, cantidad } = products[0];

    // Buscamos el carrito por su ID
    let cart = await cartModel.findOne({ _id: cid });

    // Buscamos el producto por su ID
    const product_m = await ProductModel.findById(product);

    // Calculamos el nuevo monto basado en la cantidad del producto
    const NuevoMonto = product_m.precio * cantidad;

    // Verificamos si el producto ya existe en el carrito
    const existingProductIndex = cart.products.findIndex((item) => item.product.toString() === product_m._id.toString());

    // Si el producto ya existe, aumentamos la cantidad; de lo contrario, lo agregamos
    if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].cantidad += cantidad;
    } else {
        cart.products.push({ product: product_m._id, cantidad });
    }

    // Actualizamos el monto total del carrito
    cart.monto += NuevoMonto;

    // Actualizamos el carrito en la base de datos
    const result = await cartModel.updateOne({ _id: cid }, { products: cart.products, monto: cart.monto });

    res.json({ payload: result });
});

// Actualizar la cantidad de un producto específico en el carrito
router.put('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { cantidad } = req.body;

    // Buscamos el carrito por su ID
    const cart = await cartModel.findById(cid);

    // Encontramos el índice del producto en el carrito
    const prod_cart_id = cart.products.findIndex(item => item.product.toString() === pid);

    // Actualizamos la cantidad del producto en el carrito
    cart.products[prod_cart_id].cantidad = cantidad;

    // Calculamos el nuevo total del carrito
    let total = 0;
    for (const item of cart.products) {
        const itemProduct = await ProductModel.findById(item.product);
        total += item.cantidad * itemProduct.precio;
    }

    // Actualizamos el carrito en la base de datos
    const result = await cartModel.updateOne({ _id: cid }, { products: cart.products, monto: total });

    res.json({ payload: result });
});

// Eliminar todos los productos del carrito
router.delete('/:cid', async (req, res) => {

    const { cid } = req.params

    const result = await cartModel.updateOne({ _id: cid }, { products: [], monto: 0 })

    res.json({ payload: result });
})

// Eliminar producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;

    const cart = await cartModel.findById(cid).populate('products.product')

    const ProductoEliminar = cart.products.find(item => item.product._id.toString() === pid)

    const nuevoMonto = cart.monto - (ProductoEliminar.cantidad * ProductoEliminar.product.precio)

    const result = await cartModel.updateOne({ _id: cid }, { $pull: { products: { product: pid } }, monto: nuevoMonto > 0 ? nuevoMonto : 0 })

    res.json({ payload: result })
})

export default router;