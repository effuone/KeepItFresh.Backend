import pgPool from '../database/db'
// import {body, validationResult} from 'express-validator'
class brandController {
    async createBrand(req,res){
        try{
            const {name} = req.body;
            const existingModel = await pgPool.query(`SELECT* from brands where name like $1`, [name])
            if(existingModel.rowCount > 0) res.status(400).json('Brand already exists')
            const model = await pgPool.query(`INSERT INTO brands (name) VALUES ($1) RETURNING *`, [name])
            res.status(200).json(model.rows[0])
        }catch(e){
            console.log(e)
        }
    }
    async getBrand(req,res){
        try{
            const id = req.params.id
            const model = await pgPool.query(`SELECT* FROM brands where id = $1`, [id])
            if(model.rowCount > 0)
                res.json(model.rows[0])
            else 
                return res.status(404).json('Brand not found')
        }catch(e){
            console.log(e)
        }
    }
    async getBrands(req,res){
        try{
            const models = await pgPool.query('SELECT* FROM brands')
            res.json(models.rows)
        }catch(e){
            console.log(e)
        }
    }
    async updateBrand(req,res){
        try{
            const id = req.params.id
            const {name} = req.body; 
            const existingModel = await pgPool.query(`SELECT* FROM brands where id = $1`, [id])
            if(existingModel.rowCount <= 0)
                return res.status(404).json('Brand not found')
                const query = await pgPool.query('UPDATE brands SET name = $2 WHERE id = $1', [id, name])
            if(query.rowCount >= 0)
                res.status(204).json('Successfully updated')
            else
                res.status(400)
        }catch(e){
            console.log(e)
        }
    }
    async deleteBrand(req,res){
        try{
            const id = req.params.id
            const existingModel = await pgPool.query(`SELECT* FROM brands where id = $1`, [id])
            if(existingModel.rowCount < 0)
                return res.status(404).json('Brand not found')
            const query = await pgPool.query('DELETE FROM brands where id = $1', [id])
            if(query.rowCount >= 0)
                res.status(204).json('Successfully deleted')
            else
                res.status(400)
        }catch(e){
            console.log(e)
        }
    }
}
export default new brandController()
