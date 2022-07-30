import pgPool from '../database/db'
// import {body, validationResult} from 'express-validator'
class skinTypeController {
    async createSkinType(req,res){
        try{
            const {name} = req.body;
            const existingModel = await pgPool.query(`SELECT* from skinTypes where name like $1`, [name])
            if(existingModel.rowCount > 0) res.status(400).json('Skin type already exists')
            const model = await pgPool.query(`INSERT INTO skinTypes (name) VALUES ($1) RETURNING *`, [name])
            res.status(200).json(model.rows[0])
        }catch(e){
            console.log(e)
        }
    }
    async getSkinType(req,res){
        try{
            const id = req.params.id
            const model = await pgPool.query(`SELECT* FROM skinTypes where id = $1`, [id])
            if(model.rowCount > 0)
                res.json(model.rows[0])
            else 
                return res.status(404).json('Skin type not found')
        }catch(e){
            console.log(e)
        }
    }
    async getSkinTypes(req,res){
        try{
            const models = await pgPool.query('SELECT* FROM skinTypes')
            res.json(models.rows)
        }catch(e){
            console.log(e)
        }
    }
    async updateSkinType(req,res){
        try{
            const id = req.params.id
            const {name} = req.body; 
            const existingModel = await pgPool.query(`SELECT* FROM skinTypes where id = $1`, [id])
            if(existingModel.rowCount <= 0)
                return res.status(404).json('Skin type not found')
            const query = await pgPool.query('UPDATE skintypes SET name = $2 WHERE id = $1', [id, name])
            if(query.rowCount >= 0)
                res.status(204).json('Successfully updated')
            else
                res.status(400)
        }catch(e){
            console.log(e)
        }
    }
    async deleteSkinType(req,res){
        try{
            const id = req.params.id
            const existingModel = await pgPool.query(`SELECT* FROM skinTypes where id = $1`, [id])
            if(existingModel.rowCount < 0)
                return res.status(404).json('Skin type not found')
            const query = await pgPool.query('DELETE FROM skinTypes where id = $1', [id])
            if(query.rowCount >= 0)
                res.status(204).json('Successfully deleted')
            else
                res.status(400)
        }catch(e){
            console.log(e)
        }
    }
}
export default new skinTypeController()
