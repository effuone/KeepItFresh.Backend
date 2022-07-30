import pgPool from '../database/db'
// import {body, validationResult} from 'express-validator'
class subscriptionController {
    async subscribeToUser(req,res){
        try{
            const {firstUserId, secondUserId} = req.body;
            const existingModel = await pgPool.query(`SELECT* from subscriptions where user_id = $1 and subscriber_id = $2`, [firstUserId, secondUserId])
            if(existingModel.rowCount > 0) res.status(400).json('Subscription already exists')
            const model = await pgPool.query(`INSERT INTO Subscriptions (user_id, subscriber_id, becamedate) VALUES ($1, $2, $3) RETURNING *`, [firstUserId, secondUserId, Date.now])
            res.status(200).json(model.rows[0])
        }catch(e){
            console.log(e)
        }
    }
    async getUserSubscriptions(req,res){
        try{
            const userId = req.params.id
            const models = await pgPool.query('SELECT* FROM subscriptions where userId = $1', [userId])
            res.json(models.rows)
        }catch(e){
            console.log(e)
        }
    }
    async unfollow(req,res){
        try{
            const firstUserId = req.params.id
            const secondUserId = req.params.id
            const existingModel = await pgPool.query(`SELECT* FROM Subscriptions where user_id = $1 and subscriber_id = $2`, [firstUserId, secondUserId])
            if(existingModel.rowCount < 0)
                return res.status(404).json('Subscription not found')
            const query = await pgPool.query('DELETE FROM Subscriptions where user_id = $1 and subscriber_id = $2', [firstUserId, secondUserId])
            if(query.rowCount >= 0)
                res.status(204).json('Successfully deleted')
            else
                res.status(400)
        }catch(e){
            console.log(e)
        }
    }
}
export default new subscriptionController()
