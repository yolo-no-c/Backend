import { Router } from "express";
import ProductManager from "../managers/gestorProductos.js";
import { __dirname } from "../utils.js";

const manager = new ProductManager(__dirname + "/files/products.json");
const router = Router();

router.get('/', async (req, res) => {
    const { limit } = req.query;
    const products = await manager.obtenerProductos();
    if (limit) {
        const limited = products.slice(0, limit);
        res.status(200).json(limited);
    } else {
        res.status(200).json(products);
    }
});
router.get("/:pid", async (req, res) => {
    const id = parseInt(req.params.pid);
    const product = await manager.obtenerProductosPorId(id);
    if (product) {
        res.status(200).json(product);
    } else {
        res.status(400).json({ message: "Producto no encontrado" });
    }
});

router.post('/', async (req, res) => {

    try {
        const product = await manager.agregarProducto(req.body);
        if (product === "El codigo ingresado ya existe") {
            res.status(400).json({ message: "Error al crear el producto", product });
        } else if (product === "Complete todos los campos") {
            res.status(400).json({ message: "Error al crear el producto", product });
        } else {
            res.status(201).json({ message: "Producto creado", product });
        }
    } catch (error) {
        throw new error("Error al crear el producto", error);
    }
});

router.put("/:pid", async (req, res) => {
    const id = parseInt(req.params.pid);
    const product = await manager.actualizarProducto(id, req.body);
    if (product) {
        res.status(200).json({ message: "Producto actualizado", product });
    } else {
        res.status(400).json({ message: "Error al actualizar el producto" });
    }
});
// router.delete();

export default router; //export por default para que en otras partes de mi proyecto se pueda utilizar e importar