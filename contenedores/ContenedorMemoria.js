class ContenedorArchivo {

    constructor() {
        this.productos = [];
        this.id = 0;
    }

    async all() {
        if(this.productos.length === 0) {
            return {error: 'aun no hay productos'}
        } 
        return this.productos
    }
    async save(object) {
        this.id ++;
        object.id = this.id;
        this.productos.push(object);
        // return object;
    }

    async getById(id) {
        id = parseInt(id);
        const idProd = this.productos.filter(item => item.id === id);
        if (idProd.length <= 0) {
            return {error: 'producto no encontrado'}
        } 
        return idProd
        
    }

    async delete(id) {
        id = parseInt(id)
        const delProdId = this.productos.filter(item => item.id === id)
        if(delProdId.length <= 0) {
            return {error: 'producto no encontrado'};
        } 
        this.productos = this.productos.filter(item => item.id !== id);
        return this.productos;

    }

    async update(producto, id) {
        id = parseInt(id);

        const updateProdId = this.productos.filter(item => item.id === id);
        if(updateProdId.length <= 0) {
            return {error: 'producto no encontrado'};
        }

        this.productos = this.productos.filter(item => item.id !== id);
        producto.id = id;
        this.productos.push(producto);
        return producto;
    }
}
module.exports = ContenedorArchivo