import fs from 'fs';

class ProductManager {

    constructor(filePath) {
        this.products = [];
        this.nextID = 1;
        this.path = filePath;
        this.loadProducts();
    }

    async loadProducts() {
        try {
            const data = await fs.promises.readFileSync(this.path, "utf8");
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

export default ProductManager;

function operaciones() {
    const filePath = "./products.json";

    const pimpon = new ProductManager(filePath)
    pimpon.addProduct("titulo1", "description1", 100, "thumbnail1", "#ERR", 100);
    pimpon.addProduct("titulo2", "description2", 200, "thumbnail2", "#ABC", 200);
    pimpon.addProduct("titulo3", "description3", 300, "thumbnail3", "#BNM", 300);
    pimpon.addProduct("titulo4", "description4", 400, "thumbnail4", "#KLÑ", 400);
    pimpon.addProduct("titulo5", "description5", 500, "thumbnail5", "#XYZ", 500);
    pimpon.addProduct("titulo6", "description6", 600, "thumbnail6", "#UMN", 600);
    pimpon.addProduct("titulo7", "description7", 700, "thumbnail7", "#QRS", 700);
    pimpon.addProduct("titulo8", "description8", 800, "thumbnail8", "#PQR", 800);
    pimpon.addProduct("titulo9", "description9", 900, "thumbnail9", "#FGH", 900);
    pimpon.addProduct("titulo10", "description10", 1000, "thumbnail10", "#ABC", 1000);

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
}

operaciones();
