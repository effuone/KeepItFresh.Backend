import pgPool from '../database/db'
// import {body, validationResult} from 'express-validator'
class cosmeticBagController {
    async addProductToCosmeticBag(req,res){
        try{
            const {userId, productId} = req.body;
            const existingModel = await pgPool.query(`SELECT* from cosmeticBags where user_id = $1 and product_id = $2`, [userId, productId])
            if(existingModel.rowCount > 0) res.status(400).json('This product already exists in your cosmetic bag')
            const model = await pgPool.query(`INSERT INTO cosmeticBags (user_id, product_id) VALUES ($1, $2) RETURNING *`, [userId, productId])
            res.status(200).json(model.rows[0])
        }catch(e){
            console.log(e)
        }
    }
    async getProductOfUser(req,res){
        try{
            const userId = req.params.userId
            const productId = req.params.userId
            const model = await pgPool.query(`SELECT products.name, products.image, products.price, products.storageduration, categories.name as categoryname, brands.name as brandname, products.isavailable, products.code FROM cosmeticbags, products, users, categories, brands where cosmeticbags.user_id = users.id and cosmeticbags.product_id = products.id and products.category_id = categories.id and products.brand_id = brands.id and user_id = $1 and product_id = $2`, [userId, productId])
            if(model.rowCount > 0)
                res.json(model.rows[0])
            else 
                return res.status(404).json('This product not found in your cosmetic bag')
        }catch(e){
            console.log(e)
        }
    }
    async getProductsOfUser(req,res){
        try{
            const userId = req.params.userId
            const models = await pgPool.query('SELECT products.name, products.image, products.price, products.storageduration, categories.name as categoryname, brands.name as brandname, products.isavailable, products.code FROM cosmeticbags, products, users, categories, brands where cosmeticbags.user_id = users.id and cosmeticbags.product_id = products.id and products.category_id = categories.id and products.brand_id = brands.id and user_id = $1', [userId])
            res.json(models.rows)
        }catch(e){
            console.log(e)
        }
    }
    async updateProductOfUser(req,res){
        try{
            const userId = req.params.userId
            const productId = req.params.userId
            const {newUserId, newProductId} = req.body; 
            const existingModel = await pgPool.query(`SELECT* FROM cosmeticBags where user_id = $1, product_id = $2`, [userId, productId])
            if(existingModel.rowCount <= 0)
                return res.status(404).json('This product not found in your cosmetic bag')
            const query = await pgPool.query('UPDATE cosmeticBags SET user_id = $1, product_id = $2 where user_id = $3 and product_id = $4', [userId, productId, newUserId, newProductId])
            if(query.rowCount >= 0)
                res.status(204).json('Successfully updated')
            else
                res.status(400)
        }catch(e){
            console.log(e)
        }
    }
    async deleteProductFromUser(req,res){
        try{
            const userId = req.params.userId
            const productId = req.params.userId
            const existingModel = await pgPool.query(`SELECT* from cosmeticBags where user_id = $1 and product_id = $2`, [userId, productId])
            if(existingModel.rowCount < 0)
                return res.status(404).json('This product not found in your cosmetic bag')
            const query = await pgPool.query('DELETE FROM cosmeticBags where user_id = $1 and product_id = $2', [userId, productId])
            if(query.rowCount >= 0)
                res.status(204).json('Successfully deleted')
            else
                res.status(400)
        }catch(e){
            console.log(e)
        }
    }
}
export default new cosmeticBagController()
