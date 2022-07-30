import axios from "axios"
import cheerio from 'cheerio'
const getAllSkinTypes = function (url){
    const html = axios.get(url)
    const $ = cheerio.load(html)
    $('.')
}