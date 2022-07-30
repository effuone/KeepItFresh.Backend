import express, { json } from "express";
import 'dotenv/config'
import * as routes from "./routes/routes";
import * as fs from 'fs/promises'
import * as middleware from "./middlewares";
import axios from "axios";
import cheerio from 'cheerio'
const PORT = process.env.PORT || 9090

const products = JSON.parse(await fs.readFile('products.json', {encoding: 'utf-8'}))
// console.table(products)
const getProductsPerPage = async (products, pagedUrl) => {
  const originUrl = 'https://kaspi.kz'
  const html = (await axios.get(pagedUrl, {
    withCredentials:true,
    headers:{
      "Cookie": process.env.KASPI_COOKIE,
      "User-Agent": 'PostmanRuntime/7.29.2'
    }
  })).data
  const $ = cheerio.load(html)
  $('.item-card', html).each(function () {
    const product = new Object();
    product.name = $(this).find('.item-card__name').text()
    product.price = parseInt($(this).find('.item-card__debet').text().replace(/\D/g, ''))
    product.url = originUrl + $(this).find('.item-card__name').attr('href')
    products.push(product)
  })
}



// const url = 'https://kaspi.kz/shop/c/makeup%20removers/'
// let maxPage = 132;
// const kaspiProducts = []
// await getProductsPerCategory(kaspiProducts, url)
// console.table(kaspiProducts)

const app = express()
app.use(express.json())
app.use(middleware.allowCrossDomain)
app.use('/test', async (req, res) => {
    res.send('Working')
})
app.get("/products", middleware.paginatedResults(products), (req, res) => {
    res.json(res.paginatedResults);
});
app.use('/api/', routes.authRouter)
app.use('/api/', routes.brandRouter)
app.use('/api/', routes.categoryRouter)
app.use('/api/', routes.cityRouter)
app.use('/api/', routes.countryRouter)
app.use('/api/', routes.locationRouter)
app.use('/api/', routes.productRouter)
app.use('/api/', routes.roleRouter)
app.use('/api/', routes.skinTypeRouter)
app.use('/api/', routes.subscriptionRouter)
app.use('/api/', routes.cosmeticBagRouter)
// app.use('/api/', categoryRouter)
// app.use('/api/', productRouter)
app.listen(PORT, () => {
    console.log('KeepItFresh backend launched.')
})

//registered
//redirected
//recommendations based on skinType (select* from products, categories where products.category_id = categories.category_id and categories.name like $1)
//users
//myCosmeticBag null create after registration