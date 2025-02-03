import express from "express";
import handlebars from "express-handlebars";
import { __dirname } from "./utils.js";
import connectionMongo from './dao/mongo/mongo.js';

// Importación de rutas
import ProductsRoute from "./routes/products.router.js";
import CartsRoute from "./routes/carts.router.js";
import ViewsRouter from './routes/view.routes.js'


const app = express();

// Conexión a la base de datos MongoDB
connectionMongo()
const PORT = 8080;


//Motores de plantillas y visualizaciones:
app.engine("handlebars", handlebars.engine());
app.set('views', `${__dirname}/views`)
app.set("view engine", "handlebars");

app.use(express.static(`${__dirname}/public`))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de la aplicación
app.use('/', ViewsRouter)
app.use("/api/products", ProductsRoute);
app.use("/api/carts", CartsRoute);

//Esucha el server:
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});



