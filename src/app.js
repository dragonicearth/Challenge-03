import express from 'express'
import ProductManager from './productManager.js'
const app = express()
const filePath = "./products.json";
const productManager = new ProductManager(filePath)

app.get('/products', async (req, res) => {
    try {
        await productManager.loadProducts();
        const products = productManager.getProducts();
        const limit = req.query.limit;
        if (limit) {
            res.send(products.slice(0, limit))
        } else {
            res.send(products)
        }
    } catch (error) {
        res.status(500).send({ error: 'Error al obtener los productos' });
    }
})

app.get('/products/:pid', async (req, res) => {
    try {
        const pid = parseInt(req.params.pid);
        const product = productManager.getProductsByID(pid);
        if (product) {
            res.send(product);
        } else {
            res.status(404).send({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(400).send({ error: 'ID inválido' });
    }

})


app.listen(8080)