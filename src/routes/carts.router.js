import { Router } from "express";

const router = Router();

const carts = [];

router.get('/', (req, res) => {
    res.send(carts);
    //con este metodo solictamos obtener a los usuarios: consulta
});
router.post('/', (req, res) => {
    const carts = req.body;
    productos.push(carts);
    res.send({ status: "success", message: "Producto Agregado" }) 
    //con este metodo solictamos crear usuarios
});

export default router