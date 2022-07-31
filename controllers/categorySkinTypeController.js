import pgPool from '../database/db'
// import {body, validationResult} from 'express-validator'
class categorySkinTypeController {
    async addSkinTypeToCategory(req,res){
        try{
            const {categoryId, skinTypeId} = req.body;
            const existingModel = await pgPool.query(`SELECT* from categoriesskintypes where category_id = $1 and skintype_id = $2;`, [categoryId, skinTypeId])
            if(existingModel.rowCount > 0) res.status(400).json('This product already exists in your cosmetic bag')
            const model = await pgPool.query(`INSERT INTO categoriesskintypes (category_id, skintype_id) VALUES ($1, $2) RETURNING *`, [categoryId, skinTypeId])
            res.status(200).json(model.rows[0])
        }catch(e){
            console.log(e)
        }
    }
    async getCategoriesOfSkinType(req,res){
        try{
            const skinTypeId = req.params.skinTypeId
            const model = await pgPool.query(`select* from categoriesskintypes where skintype_id = $1`, [skinTypeId])
            if(model.rowCount > 0)
                res.json(model.rows[0])
            else 
                return res.status(404).json('Not found')
        }catch(e){
            console.log(e)
        }
    }
    async getSkinTypesOfCategory(req,res){
        try{
            const categoryId = req.params.categoryId
            const model = await pgPool.query(`select* from categoriesskintypes where category_id = $1`, [categoryId])
            if(model.rowCount > 0)
                res.json(model.rows[0])
            else 
                return res.status(404).json('Not found')
        }catch(e){
            console.log(e)
        }
    }
}
export default new categorySkinTypeController()
