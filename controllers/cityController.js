import pgPool from '../database/db'
// import {body, validationResult} from 'express-validator'
class cityController {
    async createCity(req,res){
        try{
            const {name} = req.body;
            const existingModel = await pgPool.query(`SELECT* from cities where name like $1`, [name])
            if(existingModel.rowCount > 0) res.status(400).json('City already exists')
            const model = await pgPool.query(`INSERT INTO cities (name) VALUES ($1) RETURNING *`, [name])
            res.status(200).json(model.rows[0])
        }catch(e){
            console.log(e)
        }
    }
    async getCity(req,res){
        try{
            const id = req.params.id
            const model = await pgPool.query(`SELECT* FROM cities where id = $1`, [id])
            if(model.rowCount > 0)
                res.json(model.rows[0])
            else 
                return res.status(404).json('City not found')
        }catch(e){
            console.log(e)
        }
    }
    async getCities(req,res){
        try{
            const models = await pgPool.query('SELECT* FROM cities')
            res.json(models.rows)
        }catch(e){
            console.log(e)
        }
    }
    async updateCity(req,res){
        try{
            const id = req.params.id
            const {name} = req.body; 
            const existingModel = await pgPool.query(`SELECT* FROM cities where id = $1`, [id])
            if(existingModel.rowCount <= 0)
                return res.status(404).json('City not found')
            const query = await pgPool.query('UPDATE cities SET name = $2 WHERE id = $1', [id, name])
            if(query.rowCount >= 0)
                res.status(204).json('Successfully updated')
            else
                res.status(400)
        }catch(e){
            console.log(e)
        }
    }
    async deleteCity(req,res){
        try{
            const id = req.params.id
            const existingModel = await pgPool.query(`SELECT* FROM cities where id = $1`, [id])
            if(existingModel.rowCount < 0)
                return res.status(404).json('City not found')
            const query = await pgPool.query('DELETE FROM cities where id = $1', [id])
            if(query.rowCount >= 0)
                res.status(204).json('Successfully deleted')
            else
                res.status(400)
        }catch(e){
            console.log(e)
        }
    }
}
export default new cityController()
