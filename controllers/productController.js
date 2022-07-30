import pgPool from '../database/db'
// import {body, validationResult} from 'express-validator'
class productController {
    async createProduct(req,res){
        try{
            const {name, image, price, storageDuration, categoryId, brandId, isAvailable, code} = req.body;
            const existingModel = await pgPool.query(`SELECT* from products where name like $1`, [name])
            if(existingModel.rowCount > 0) res.status(400).json('Product already exists')
            const model = await pgPool.query(`INSERT INTO products (name, image, price, storageduration, categoryId, brandId, isavailable, code) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
            [name, image, price, storageDuration, categoryId, brandId, isAvailable, code])
            res.status(200).json(model.rows[0])
        }catch(e){
            console.log(e)
        }
    }
    async getProduct(req,res){
        try{
            const id = req.params.id
            const model = await pgPool.query(`SELECT* FROM products where id = $1`, [id])
            if(model.rowCount > 0)
                res.json(model.rows[0])
            else 
                return res.status(404).json('Product not found')
        }catch(e){
            console.log(e)
        }
    }
    async getProducts(req,res){
        try{
            const models = await pgPool.query('SELECT* FROM products')
            res.json(models.rows)
        }catch(e){
            console.log(e)
        }
    }
    async updateProduct(req,res){
        try{
            const id = req.params.id
            const {name, image, price, storageDuration, categoryId, brandId, isAvailable, code} = req.body;
            const existingModel = await pgPool.query(`SELECT* FROM products where id = $1`, [id])
            if(existingModel.rowCount <= 0)
                return res.status(404).json('Product not found')
            const query = await pgPool.query('UPDATE products SET name = $2, image = $3, price = $4, storageduration = $5, category_id = $6, brand_id = $7, isavailable = $8, code = $9 where id = $1',
            [id, name, image, price, storageDuration, categoryId, brandId, isAvailable, code])
            if(query.rowCount >= 0)
                res.status(204).json('Successfully updated')
            else
                res.status(400)
        }catch(e){
            console.log(e)
        }
    }
    async deleteProduct(req,res){
        try{
            const id = req.params.id
            const existingModel = await pgPool.query(`SELECT* FROM products where id = $1`, [id])
            if(existingModel.rowCount < 0)
                return res.status(404).json('Product not found')
            const query = await pgPool.query('DELETE FROM products where id = $1', [id])
            if(query.rowCount >= 0)
                res.status(204).json('Successfully deleted')
            else
                res.status(400)
        }catch(e){
            console.log(e)
        }
    }
}
export default new productController()
