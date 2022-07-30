import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import {validationResult} from 'express-validator'
import 'dotenv/config'
import pgPool from '../database/db'
import nodemailer from 'nodemailer'
import sendEmail from '../services/mailService';

const generateAccessToken = (id, role)=> {
    const payload = {
        id, role
    }
    return jwt.sign(payload, process.env.JWT_KEY, {expiresIn:'24h'})
}

class authController {
    async registration(req,res){
        try{
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                return res.status(400).json({message:"Registration error", errors})
            }
            const {username, password, birthday, firstName, image, skinTypeId, locationId, email, phoneNumber, isCosmeticBagAvailable} = req.body
            const candidate = await pgPool.query('SELECT* FROM users where username like $1', [username])
            if(candidate.rowCount >= 1) {
                return res.status(400).json({message:'This user already exists'})
            }
            const hashPassword = bcrypt.hashSync(password, 7);
            const newUser = await pgPool.query(
                'INSERT INTO users (username, birthday, first_name, image, skin_type_id, location_id, email, email_confirmed, password_hash, phone_number, iscosmeticbagavailable)'
                +
                'VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10, $11) RETURNING *'
            , [username, birthday, firstName, image, skinTypeId,locationId,email,0,hashPassword,phoneNumber, isCosmeticBagAvailable])
            await pgPool.query('INSERT INTO userroles (userid, roleid) values ($1,$2) RETURNING *', [newUser.rows[0].id, 1])
            const verificationLink = (process.env.WEBAPP_URL + '/confirmEmail/' + (newUser.rows[0]).id)
            console.log(verificationLink)
            sendEmail(
                email, 
                "Keep It Fresh service email verification", 
                "Confirm", 
                `<form action=${verificationLink} method='POST'><div><button><h1>Confirm email</h1></button></div></form>`
            )
            return res.json({message: "User created successfull! Confirm your email."})
        }catch(e){
            console.log(e)
            res.status(400).json({message: 'Registration error'})
        }
    }

    async login(req,res){
        try{
            const {username, password} = req.body
            const getUserQuery = await pgPool.query('SELECT* FROM users where username like $1', [username])
            if(getUserQuery.rowCount <= 0 ) {
                return res.status(400).json({message:'User not found or wrong password'})
            }
            const dbUserId = (getUserQuery.rows[0]).id
            const role = await pgPool.query('SELECT users.id, roles.name FROM userroles, users, roles where userroles.userid = users.id and userroles.roleid = roles.id and users.id = $1', [dbUserId])
            const dbPassword = (getUserQuery.rows[0]).password_hash
            const validPassword = bcrypt.compareSync(password, dbPassword)
            if(!validPassword)
            {
                return res.status(400).json({message:'User not found or wrong password'})
            }
            console.log((getUserQuery.rows[0]).email_confirmed)
            if(!(getUserQuery.rows[0]).email_confirmed)
            {
                return res.status(400).json({message:"Confirm your email first"})
            }
            const token = generateAccessToken(dbUserId, (role.rows[0]).name)
            return res.json({token})
        }catch(e){

        }
    }
    async updateUser(req,res){
        try{
            const id = req.params.id
            const {username, password, birthday, firstName, image, skinTypeId, locationId, email, phoneNumber, isCosmeticBagAvailable} = req.body; 
            const existingModel = await pgPool.query(`SELECT* FROM users where id = $1`, [id])
            if(existingModel.rowCount <= 0)
                return res.status(404).json('User not found')
            const query = await pgPool.query('UPDATE users SET username = $2, birthday = $3, first_name = $4, image = $5, skin_type_od = $6, location_id = $7, email = $8, phone_number = $9, iscosmeticbagavailable = $10 WHERE id = $1',
             [id, username, birthday, firstName, image, skinTypeId, locationId, email, phoneNumber, isCosmeticBagAvailable])
            if(query.rowCount >= 0)
                res.status(204).json('Successfully updated')
            else
                res.status(400)
        }catch(e){
            console.log(e)
        }
    }
    async verifyEmail(req,res){
        try{
            const id = req.params.id
            const existingModel = await pgPool.query(`SELECT* FROM users where id = $1`, [id])
            if(existingModel.rowCount <= 0)
                return res.status(404).json('User not found')
            const query = await pgPool.query('UPDATE users SET email_confirmed = $2 WHERE id = $1',[id, true])
            if(query.rowCount >= 0)
            {
                res.redirect(process.env.FRONTAPP_URL);
            }
            else
                res.status(400)
        }catch(e){
            console.log(e)
        }
    }
    async resetPassword(req,res){
        try{
            const id = req.params.id
            const {password} = req.body; 
            const existingModel = await pgPool.query(`SELECT* FROM users where id = $1`, [id])
            if(existingModel.rowCount <= 0)
                return res.status(404).json('User not found')
            const newHashPassword = bcrypt.hashSync(password, 7);
            const query = await pgPool.query('UPDATE users SET password_hash = $2 WHERE id = $1',[id, newHashPassword])
            if(query.rowCount >= 0)
                res.status(204).json('Successfully reseted password')
            else
                res.status(400)
        }catch(e){
            console.log(e)
        }
    }
    async getUsers(req,res){
        try{
            const models = await pgPool.query('SELECT username, first_name, image FROM users')
            res.json(models.rows)
        }catch(e){
            console.log(e)
        }
    }
    async getUser(req,res){
        try{
            const id = req.params.id
            const model = await pgPool.query(`SELECT users.username, users.image, users.first_name, skintypes.name as skintype, FROM users where id = $1`, [id])
            if(model.rowCount > 0)
                res.json(model.rows[0])
            else 
                return res.status(404).json('User not found')
        }catch(e){
            console.log(e)
        }
    }
    async deleteUser(req,res){
        try{
            const id = req.params.id
            const existingModel = await pgPool.query(`SELECT* FROM users where id = $1`, [id])
            if(existingModel.rowCount < 0)
                return res.status(404).json('User not found')
            const query = await pgPool.query('DELETE FROM users where id = $1', [id])
            if(query.rowCount >= 0)
                res.status(204).json('Successfully deleted')
            else
                res.status(400)
        }catch(e){
            console.log(e)
        }
    }
}

export default new authController()