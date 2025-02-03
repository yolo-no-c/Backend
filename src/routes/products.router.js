import { Router } from "express";
import { ProductModel } from "../dao/mongo/models/products.model.js";
import { ProductManager } from "../dao/productManager.js";

const router = Router();
const model = new ProductManager(ProductModel);

// Obtener todos los productos
router.get('/', async (req, res) => {
    const query = req.query; // Obtiene los parámetros de consulta de la solicitud

    console.log("Informacion de la peticion",query);
    const filter = {}; // Inicializa el objeto de filtro
    if (query.titulo) { filter.titulo = query.titulo; } // Filtra por título si se proporciona
    if (query.categoria) { filter.categoria = query.categoria; } // Filtra por categoría si se proporciona
    const sorted = { // Define las opciones de ordenamiento
        'asc': 1,
        'desc': -1,
        default: 0
    };
    const opcion = { // Configura las opciones para la paginación
        limit: query.limit || 10, // Limite de resultados por página
        page: query.page || 1, // Número de página actual
        ...(query.sort ? { sort: { precio: sorted[query.sort] } } : {}) // Ordena por precio si se proporciona
    };
    const result = await model.paginate(filter, opcion); // Obtiene los productos paginados
    console.log("Imprime el resultado en consola",result); // Imprime el resultado en la consola
    const response = { // Crea un objeto de respuesta
        status: 'success',
        payload: result.docs, // Productos obtenidos
        totalPages: result.totalPages, // Total de páginas
        prevPage: result.prevPage, // Página anterior
        nextPage: result.nextPage, // Página siguiente
        page: result.page, // Página actual
        hasPrevPage: result.hasPrevPage, // Indica si hay página anterior
        hasNextPage: result.hasNextPage, // Indica si hay página siguiente
        prevLink: `page=${result.prevPage}&limit=${query.limit}`, // Enlace a la página anterior
        nextLink: `page=${result.nextPage}&limit=${query.limit}` // Enlace a la página siguiente
    };
    res.json({ response }); // Envía la respuesta en formato JSON
});

// Obtener un producto por ID
router.get('/:id', async (req, res) => {
    const { id } = req.params; // Obtiene el ID del producto de los parámetros
    const product = await model.findById({ _id: id }); // Busca el producto por ID
    if (!product) return res.json({ mensaje: 'Error', payload: null }); // Si no se encuentra, devuelve un mensaje de error
    res.json({ payload: product }); // Devuelve el producto encontrado
});

// Eliminar un producto por ID
router.delete('/:pid', async (req, res) => {
    const { pid } = req.params; // Obtiene el ID del producto a eliminar
    const product = await model.findByQuery({ _id: pid }); // Busca el producto por ID
    if (!product) return res.status(404).json({ mensaje: 'Producto no encontrado' }); // Devuelve un mensaje si no se encuentra
    const result = await model.deleteById(pid); // Elimina el producto por ID
    res.json({ payload: result }); // Devuelve el resultado de la eliminación
});

export default router;