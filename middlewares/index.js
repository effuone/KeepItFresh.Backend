import jwt from 'jsonwebtoken'
import 'dotenv/config'
import pgPool from '../database/db';
export function paginatedResults(model) {
    // middleware function
    return (req, res, next) => {
      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);
   
      // calculating the starting and ending index
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
   
      const results = {};
      if (endIndex < model.length) {
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
   
      results.results = model.slice(startIndex, endIndex);
   
      res.paginatedResults = results;
      next();
    };
}
export function allowCrossDomain(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}
export async function isAdmin (req,res,next) {
    if(req.method === 'OPTIONS') next()
    try{
        const token = req.headers.authorization.split(' ')[1]
        if(!token) return res.status(403).json({message:"User unauthorized."})
        const decodeData = jwt.verify(token, process.env.JWT_KEY)
        req.user = decodeData
        if(decodeData === 'admin') next()
        else return res.status(403).json({message:"User unauthorized."}) 

    } catch(e){
        console.log(e)
        return res.status(403).json({message:"User unauthorized."})
    }      
}
export async function isUser (req,res,next) {
    if(req.method === 'OPTIONS') next()
    try{
        const token = req.headers.authorization.split(' ')[1]
        if(!token) return res.status(403).json({message:"User unauthorized."})
        const decodeData = jwt.verify(token, process.env.JWT_KEY)
        req.user = decodeData
        if(decodeData.role === 'user' || decodeData.role === 'admin') next()
        else return res.status(403).json({message:"User unauthorized."}) 

    } catch(e){
        console.log(e)
        return res.status(403).json({message:"User unauthorized."})
    }      
}