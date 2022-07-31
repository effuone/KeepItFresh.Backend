import pgPool from '../database/db'
// import {body, validationResult} from 'express-validator'
class productController {
    async createProduct(req,res){
        try{
            const {name, image, price, storageDuration, categoryId, brandId, isAvailable, code, numberOfRatings, rating} = req.body;
            const existingModel = await pgPool.query(`SELECT* from products where name like $1`, [name])
            if(existingModel.rowCount > 0) res.status(400).json('Product already exists')
            const model = await pgPool.query(`INSERT INTO products (name, image, price, storageduration, category_id, brand_id, isavailable, code, numberofratings, rating) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [name, image, price, storageDuration, categoryId, brandId, isAvailable, code,numberOfRatings,rating ])
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
            const models = (await pgPool.query('SELECT* FROM products')).rows
            const page = parseInt(req.query.page);
            const limit = parseInt(req.query.limit);
        
            // calculating the starting and ending index
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
        
            const results = {};
            if (endIndex < models.length) {
                results.next = {
                page: page + 1,
                limit: limit
                };
            }
        
            if (startIndex > 0) {
                results.previous = {
                page: page - 1,
                limit: limit
                };
            }
            results.results = models.slice(startIndex, endIndex);
        
            // res.paginatedResults = results;
            res.json(results)
        }catch(e){
            console.log(e)
        }
    }
    async getProductsForUser(req,res){
        const userId = req.params.id;
        try{
            const models = (await pgPool.query('select products.id, products.name, products.image, products.price, products.storageduration, categories.name as category, brands.name as brand, products.numberofratings, products.rating from products, categories, skintypes, categoriesskintypes, users, brands where categoriesskintypes.category_id = categories.id and categoriesskintypes.skintype_id = skintypes.id and products.category_id = categories.id and users.skin_type_id = skintypes.id and products.brand_id = brands.id and users.id = $1', [userId])).rows
            const page = parseInt(req.query.page);
            const limit = parseInt(req.query.limit);
        
            // calculating the starting and ending index
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
        
            const results = {};
            if (endIndex < models.length) {
                results.next = {
                page: page + 1,
                limit: limit
                };
            }
        
            if (startIndex > 0) {
                results.previous = {
                page: page - 1,
                limit: limit
                };
            }
            results.results = models.slice(startIndex, endIndex);
            res.json(results)
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
