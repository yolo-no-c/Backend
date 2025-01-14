import { Router } from "express";
import CartsManager from "../class/cartsManager.js";
import { __dirname } from "../utils.js";

const router = Router();
const cartsManager = new CartsManager(__dirname + "/data/carts.json");

router.post("/", async (req, res) => {
    try {
        const newId = await cartsManager.addCart();
        res
            .status(201)
            .json({ mensaje: "Carrito creado con exito", new_id_carrito: newId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/:cid", async (req, res) => {
    const cid = parseInt(req.params.cid);
    try {
        const data = await cartsManager.getCart(cid);
        res.status(200).json(data);
    } catch (error) {
        res
            .status(404)
            .json({ mensaje: "El ID no se encuentra en la base de datos", error: error.message });
    }
});

router.post("/:cid/products/:pid", async (req, res) => {
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid);
    try {
        await cartsManager.addProductToCart(cid, pid);
        res.status(200).json({ mensaje: "Producto agregado al carrito con exito" });
    } catch (error) {
        res.status(404).json({
            mensaje: "No se pudo agregar el producto al carrito :(",
            error: error.message,
        });
    }
});

export default router;