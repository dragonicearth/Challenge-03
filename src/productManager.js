const fs = require('fs');

class ProductManager {

    constructor(filePath) {
        this.products = [];
        this.nextID = 1;
        this.path = filePath;
        this.loadProducts();
    }

    loadProducts() {
        try {
            const data = fs.readFileSync(this.path, "utf8");
            this.products = JSON.parse(data);
            this.nextID = Math.max(...this.products.map(product => product.id), 0) + 1;
        } catch (error) {
            this.products = [];
        }
    }

    saveProducts() {
        const data = JSON.stringify(this.products, null, 2);
        fs.writeFileSync(this.path, data);
    }

    addProduct(title, description, price, thumbnail, code, stock) {

        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.log('Todos los campos deben ser obligatorios');
            return
        }

        const codeExist = this.products.some(product => product.code === code)
        if (codeExist) return console.log("Code ya existe!");

        const newProduct = {
            id: this.nextID++,
            title,
            description,
            thumbnail,
            code,
            stock
        }
        this.products.push(newProduct)
        this.saveProducts()
    }

    getProducts() {
        return this.products;
    }

    getProductsByID(id) {
        const product = this.products.find(product => product.id === id)
        if (product) {
            return product
        } else {
            console.log("Not found");
            return null;
        }
    }

    updateProduct(id, updatedProduct) {
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            this.products[index] = { id, ...updatedProduct };
            this.saveProducts();
            return true;
        }
        return false;
    }

    deleteProduct(id) {
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            this.products.splice(index, 1);
            this.saveProducts();
            return true;
        }
        return false;
    }

}

const filePath = "./products.json";

const pimpon = new ProductManager(filePath)
pimpon.addProduct("titulo", "description", 89, "thumbnail", "#ABC", 50);
pimpon.addProduct("titulo2", "description2", 101, "thumbnail", "#JBK", 877);
pimpon.addProduct("titulo3", 500, "thumbnail", "#ERR", 800);
console.log(pimpon.getProducts());
console.log(pimpon.getProductsByID(4));

const updatedProduct = {
    title: "Producto Modificado",
    description: "Nueva descripción",
    price: 100,
    thumbnail: "newThumbnail",
    code: "#XYZ",
    stock: 30
};

const updateResult = pimpon.updateProduct(1, updatedProduct);
console.log("¿Producto actualizado correctamente?", updateResult);
console.log("Productos después de la modificación:");
console.log(pimpon.getProducts());

const deleteResult = pimpon.deleteProduct(2);
console.log("¿Producto eliminado correctamente?", deleteResult);
console.log("Productos después de la eliminación:");
console.log(pimpon.getProducts());