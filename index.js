import express, { json } from "express";
import 'dotenv/config'
import * as routes from "./routes/routes";
import * as fs from 'fs/promises'
import * as fss from 'fs'
import * as middleware from "./middlewares";
import axios from "axios";
import cheerio from 'cheerio'
import sendEmail from "./services/mailService";
const PORT = process.env.PORT || 9090

// console.table(products)

const getSubCategories = async (categoryUrl) => {
  const originUrl = 'https://kaspi.kz'
  const html = (await axios.get(pagedUrl, {
    withCredentials:true,
    headers:{
      "Cookie": process.env.KASPI_COOKIE,
      "User-Agent": 'PostmanRuntime/7.29.2'
    }
  })).data
  const $ = cheerio.load(html)
  $('.catalog-grid__sub-el-text', html).each(function () {
    console.log($(this).text())
  })
}
const getBrands = async (url = 'https://kaspi.kz/shop/c/makeup%20removers/') => {
  const brands = []
  const html = (await axios.get(url, {
    withCredentials:true,
    headers:{
      "User-Agent": 'PostmanRuntime/7.29.2'
    }
  })).data
  const $ = cheerio.load(html)
  $('.filters__filter-row__description', html).each(function(){
    brands.push($(this).find('.filters__filter-row__description-label').text())
  })
  return brands
}

const getProductsPerPage = async (products, pagedUrl) => {
  const originUrl = 'https://kaspi.kz'
  const html = (await axios.get(pagedUrl, {
    withCredentials:true,
    headers:{
      "User-Agent": 'PostmanRuntime/7.29.2'
    }
  })).data
  const $ = cheerio.load(html)
  $('.item-card', html).each(async function () {
    const product = new Object();
    product.name = $(this).find('.item-card__name').text().replace('\n', '')
    product.price = parseInt($(this).find('.item-card__debet').text().replace(/\D/g, ''))
    product.url = originUrl + $(this).find('.item-card__name').attr('href')
    product.numberOfRatings = parseInt($(this).find('.item-card__rating').text().replace(/\D/g, ''))
    product.rating = parseInt($(this).find('span').attr('class').replace(/\D/g, ''))
    product.categoryId = Math.floor(
      Math.random() * (9) + 1
    )
    product.brandId = Math.floor(
      Math.random() * (484) + 4
    )
    product.isAvailable = true;
    product.storageDuration = Math.floor(
      Math.random() * (350-250) + 250
    )
    product.code = Math.floor(
      Math.random() * (1000000000-9000000) + 9000000
    )
    console.log(product)
    products.push(product)
  })
}


// const url = 'https://kaspi.kz/shop/c/makeup%20removers'
// let maxPage = 130;
// const mproducts = [];
// for (let i = 1; i <= maxPage; i++) {
//   await getProductsPerPage(mproducts, url+`?page=${i}`)
// }
// await fs.writeFile('makeUpProducts.json', JSON.stringify(mproducts))

// const makeUpProducts = JSON.parse(await fs.readFile('makeUpProducts.json', {encoding:"utf8"}))



// const originUrl = 'https://kaspi.kz'
//   const html = (await axios.get('https://kaspi.kz/shop/c/skin%20care/', {
//     withCredentials:true,
//     headers:{
//       "User-Agent": 'PostmanRuntime/7.29.2'
//     }
//   })).data
//   const categories = []
//   const $ = cheerio.load(html)
//   $('.catalog-grid__sub-el', html).each(function () {
//     const category = new Object()
//     category.name = $(this).text().replace(/\s+/g, ' ')
//     category.url = $(this).find('a').attr('href')
//     categories.push(category)
// })
// await fs.writeFile('categories.json', JSON.stringify(categories))

const app = express()
app.use(express.json())
app.use(middleware.allowCrossDomain)
app.use('/test', async (req, res) => {
    res.send('Working')
})
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
// const makeup = JSON.parse(await fs.readFile('makeUpProducts.json', {encoding:"utf8"}))
// makeup.forEach( async product => {
//     const html = (await axios.get(product.url, {
//     withCredentials:true,
//     headers:{
//       "Cookie": process.env.KASPI_COOKIE,
//       "User-Agent": 'PostmanRuntime/7.29.2'
//     }
//   })).data
//   const $ = cheerio.load(html)
//   product.image = (JSON.parse(($('script').get()[15]).children[0].data.split('window.digitalData.product=')[1].slice(0, -1))).primaryImage.medium
//   return product
// });
// const newProducts = []
// let i = 1;
// setTimeout(()=>{
//   makeup.forEach(async product => {
//     const html = (await axios.get(product.url, {
//       withCredentials:true,
//       headers:{
//         "Cookie": process.env.KASPI_COOKIE,
//         "User-Agent": 'PostmanRuntime/7.29.2'
//       }
//     })).data
//     const $ = cheerio.load(html)
//     const image = (JSON.parse(($('script').get()[15]).children[0].data.split('window.digitalData.product=')[1].slice(0, -1))).primaryImage.medium
//     product.image = image
//     fss.writeFileSync('product' + i + '.json', JSON.stringify(product))
//     i++;
//   })
// },5000)
// const newProducts = JSON.parse(await fs.readFile('newProducts.json', {encoding:"utf8"}))  
// newProducts.forEach(async product => {
//     const response = await axios({
//       method: 'post',
//       url: process.env.WEBAPP_URL+'/products',
//       data: {
//           'name': product.name,
//           'image': product.image,
//           'price': product.price,
//           'storageDuration': product.storageDuration,
//           'categoryId': product.categoryId,
//           'brandId': product.brandId,
//           'isAvailable': product.isAvailable,
//           'code': product.code,
//           'numberOfRatings': product.numberOfRatings,
//           'rating': product.rating
//       },
//       headers: {
//         'Content-Type': 'application/json'
//       } 
//   })
//   console.log(response.status)
//   return response.data
// });
// setTimeout(()=>{
//   console.log(makeup)
//   fss.writeFileSync('newProducts.json', JSON.stringify(newProducts))
// },1000)
// fs.writeFile('newProducts.json', JSON.stringify(makeup))
//registered
//redirected
//recommendations based on skinType (select* from products, categories where products.category_id = categories.category_id and categories.name like $1)
//users
//myCosmeticBag null create after registration