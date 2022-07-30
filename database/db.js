import {Pool} from "postgres-pool"
import 'dotenv/config'
// const pgPool = new Pool({
//     host: process.env.POSTGRES_HOST,
//     port: process.env.POSTGRES_PORT,
//     database: process.env.POSTGRES_DATABASE,
//     user: process.env.POSTGRES_USERNAME,
//     password: process.env.POSTGRES_PASSWORD,
//     // ssl:{
//     //     rejectUnauthorized: false
//     // }
// })
const pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:{
        rejectUnauthorized: false
    }
})
export default pgPool