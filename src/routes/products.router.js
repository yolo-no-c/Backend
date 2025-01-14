import { Router } from "express";
import ProductManager from "../class/productManager.js";
import { __dirname } from "../utils.js";

const router = Router();
const productManager = new ProductManager(__dirname + "/data/products.json");

router.get("/", async (req, res) => {
    try {
        const data = await productManager.getAllProducts();
        res.json(data);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener los productos" });
    }
});

router.get("/:pid", async (req, res) => {
    try {
        const pid = req.params.pid;
        const data = await productManager.getProduct(pid);
        if (data) {
            res.json(data);
        } else {
            res.status(404).json({ mensaje: "No se encontro el producto" });
        }
    } catch {
        res.status(404).json({ mensaje: "Error al obtener el producto" });
    }
});

router.post("/", async (req, res) => {
    try {
        const newProduct = req.body;
        await productManager.addProduct(newProduct);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al agregar el producto" });
    }
});

router.put("/:pid", async (req, res) => {
    const pid = req.params.pid;
    const newProduct = req.body;
    try {
        await productManager.updateProduct(newProduct, pid);
        res.status(200).json(newProduct);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar el producto" });       
    }
});

router.delete("/:pid", async (req, res) => {
    const pid = req.params.pid;
    try {
        await productManager.deleteProduct(pid);
        res.status(200).json({ mensaje: "Producto eliminado" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar el producto" });
    }
});

export default router;