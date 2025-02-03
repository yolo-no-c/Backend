export class ProductManager {
    constructor(model) {
        this.model = model;
    }

    // Método para agregar un nuevo producto
    async add(product) {
        try {
            const result = await this.model.create(product);
            return result;
        } catch (error) {
            console.error('Error al agregar el producto:', error);
            return error;
        }
    }

    // Método para editar un producto existente por ID
    async edit(product, id) {
        try {
            const result = await this.model.findByIdAndUpdate(id, product, { new: true });
            return result;
        } catch (error) {
            console.error('Error al editar el producto:', error);
            return error;
        }
    }

    // Método para editar productos utilizando una consulta
    async editByQuery(product, query) {
        try {
            const result = await this.model.findOneAndUpdate(query, product, { new: true });
            return result;
        } catch (error) {
            console.error('Error al editar el producto por consulta:', error);
            return error;
        }
    }

    // Método para encontrar un producto por ID
    async findById(id) {
        try {
            const result = await this.model.findById(id);
            return result;
        } catch (error) {
            console.error('Error al encontrar el producto por ID:', error);
            return error;
        }
    }

    // Método para encontrar todos los productos
    async find() {
        try {
            const result = await this.model.find();
            return result;
        } catch (error) {
            console.error('Error al encontrar todos los productos:', error);
            return error;
        }
    }

    // Método para encontrar productos usando una consulta
    async findByQuery(query = {}) {
        try {
            const result = await this.model.find(query);
            return result;
        } catch (error) {
            console.error('Error en findByQuery:', error);
            return error;
        }
    }

    // Método para eliminar un producto por ID
    async deleteById(id) {
        try {
            const result = await this.model.deleteOne({ _id: id });
            return result;
        } catch (error) {
            console.error('Error al eliminar el producto por ID:', error);
            return error;
        }
    }

    // Método para eliminar productos utilizando una consulta
    async deleteByQuery(query) {
        try {
            const result = await this.model.deleteMany(query);
            return result;
        } catch (error) {
            console.error('Error al eliminar productos por consulta:', error);
            return error;
        }
    }

    // Método para paginar resultados
    async paginate(filter, options) {
        try {
            const result = await this.model.paginate(filter, options);
            return result;
        } catch (error) {
            console.error('Error en la paginación:', error);
            return error;
        }
    }
}

export default ProductManager;
