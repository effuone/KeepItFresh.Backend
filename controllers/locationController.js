import pgPool from '../database/db'
// import {body, validationResult} from 'express-validator'
class locationController {
    async createLocation(req,res){
        try{
            const {cityId, countryId} = req.body;
            const existingModel = await pgPool.query(`SELECT* from locations where country_id = $1 and city_id = $2`, [countryId, cityId])
            if(existingModel.rowCount > 0) res.status(400).json('Location already exists')
            const model = await pgPool.query(`INSERT INTO locations (country_id, city_id) VALUES ($1, $2) RETURNING *`, [countryId, cityId])
            res.status(200).json(model.rows[0])
        }catch(e){
            console.log(e)
        }
    }
    async getLocation(req,res){
        try{
            const id = req.params.id
            const model = await pgPool.query(`SELECT* FROM locations where id = $1`, [id])
            if(model.rowCount > 0)
                res.json(model.rows[0])
            else 
                return res.status(404).json('Location not found')
        }catch(e){
            console.log(e)
        }
    }
    async getLocations(req,res){
        try{
            const models = await pgPool.query('SELECT locations.id, countries.name as country, cities.name as cities FROM locations, countries, cities WHERE locations.city_id = cities.id and locations.country_id = countries.id')
            res.json(models.rows)
        }catch(e){
            console.log(e)
        }
    }
    async updateLocation(req,res){
        try{
            const id = req.params.id
            const {countryId, cityId} = req.body; 
            const existingModel = await pgPool.query(`SELECT* FROM locations where id = $1`, [id])
            if(existingModel.rowCount <= 0)
                return res.status(404).json('Location not found')
            const query = await pgPool.query('UPDATE locations SET country_id = $2, city_id = $3 WHERE id = $1', [id, countryId, cityId])
            if(query.rowCount >= 0)
                res.status(204).json('Successfully updated')
            else
                res.status(400)
        }catch(e){
            console.log(e)
        }
    }
    async deleteLocation(req,res){
        try{
            const id = req.params.id
            const existingModel = await pgPool.query(`SELECT* FROM locations where id = $1`, [id])
            if(existingModel.rowCount < 0)
                return res.status(404).json('Location not found')
            const query = await pgPool.query('DELETE FROM locations where id = $1', [id])
            if(query.rowCount >= 0)
                res.status(204).json('Successfully deleted')
            else
                res.status(400)
        }catch(e){
            console.log(e)
        }
    }
}
export default new locationController()
