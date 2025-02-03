import mongoose from "mongoose";
import dotenv from "dotenv";

// Cargar variables de entorno desde el archivo .env
dotenv.config();

/**
 * Función para establecer la conexión con la base de datos MongoDB.
 */
const connectionMongo = async () => {
    try {
        // Intentar conectar a la base de datos
        await mongoose.connect(process.env.MONGO_URL, {
            dbName: 'Products' // Nombre de la base de datos
        });
        console.log('Base de datos conectada exitosamente');
    } catch (error) {
        // Manejo de errores en caso de fallo en la conexión
        console.error(`Error al conectarse a la base de datos: ${error.message}`);
    }
};

// Exportar la función de conexión para su uso en otros módulos
export default connectionMongo;
