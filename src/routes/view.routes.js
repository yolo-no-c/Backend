import { Router } from "express";
import { ProductModel } from "../dao/mongo/models/products.model.js";
import { ProductManager } from "../dao/productManager.js";

const router = Router();
const productManager = new ProductManager(ProductModel);

// Renderizar la página de inicio
router.get('/', (req, res) => {
    res.render('home', {
        css: 'style'
    });
});

// Renderizar un producto específico mediante su ID
router.get('/products/:pid', async (req, res) => {
    const { pid } = req.params;

    try {
        // Buscar el producto por su ID
        const product = await ProductModel.findById(pid);

        // Verificar si el producto no fue encontrado
        if (!product) {
            return res.status(404).render('home', {
                error: 'Producto no encontrado'
            });
        }

        // Renderizar los detalles del producto
        res.render('infoproduct', {
            product: {
                _id: product._id,
                titulo: product.titulo,
                description: product.description,
                imagen: product.imagen,
                precio: product.precio,
                stock: product.stock,
                categoria: product.categoria
            },
            css: 'infoprod'
        });
    } catch (error) {
        console.error("Error al obtener el producto:", error);
        res.status(500).render('home', {
            error: 'Error interno del servidor'
        });
    }
});


export default router;
