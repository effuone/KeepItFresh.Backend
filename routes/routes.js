import { Router } from "express";
import authController from "../controllers/authController";
import productController from '../controllers/productController'
import cityController from "../controllers/cityController";
import countryController from "../controllers/countryController";
import locationController from "../controllers/locationController";
import roleController from "../controllers/roleController";
import skinTypeController from "../controllers/skinTypeController";
import categoryController from "../controllers/categoryController";
import brandController from "../controllers/brandController";
import cosmeticBagController from "../controllers/cosmeticBagController";
import subscriptionController from "../controllers/subscriptionController";
import categorySkinTypeController from "../controllers/categorySkinTypeController";
import { isAdmin, isUser } from "../middlewares";

export const authRouter = new Router();
authRouter.get('/user/:id', authController.getUser)
authRouter.post('/register/', authController.registration)
authRouter.post('/login/', authController.login)
authRouter.get('/confirmEmail/:id', authController.verifyEmail)

export const productRouter = new Router();
productRouter.post('/products/', productController.createProduct)
productRouter.get('/products/', productController.getProducts)
productRouter.get('/recommendations/:id', productController.getProductsForUser)
productRouter.get('/products/:id', isUser, productController.getProduct)
productRouter.put('/products/:id', isUser, productController.updateProduct)
productRouter.delete('/products/:id', isUser, productController.deleteProduct)

export const categoryRouter = new Router();
categoryRouter.post('/categories/', categoryController.createCategory)
categoryRouter.get('/categories/', isUser, categoryController.getCategories)
categoryRouter.get('/categories/:id', isUser, categoryController.getCategory)
categoryRouter.put('/categories/:id', isAdmin, categoryController.updateCategory)
categoryRouter.delete('/categories/:id', isAdmin, categoryController.deleteCategory)

export const brandRouter = new Router();
brandRouter.post('/brands/', brandController.createBrand)
brandRouter.get('/brands/', brandController.getBrands)
brandRouter.get('/brands/:id', brandController.getBrand)
brandRouter.put('/brands/:id', brandController.updateBrand)
brandRouter.delete('/brands/:id', brandController.deleteBrand)

export const skinTypeRouter = new Router();
skinTypeRouter.post('/skinTypes/', isAdmin, skinTypeController.createSkinType)
skinTypeRouter.get('/skinTypes/', skinTypeController.getSkinTypes)
skinTypeRouter.get('/skinTypes/:id', skinTypeController.getSkinType)
skinTypeRouter.put('/skinTypes/:id', isAdmin, skinTypeController.updateSkinType)
skinTypeRouter.delete('/skinTypes/:id', isAdmin, skinTypeController.deleteSkinType)

export const roleRouter = new Router();
roleRouter.post('/roles/', isAdmin, roleController.createRole)
roleRouter.get('/roles/', isAdmin, roleController.getRoles)
roleRouter.get('/roles/:id', isUser, roleController.getRole)
roleRouter.put('/roles/:id', isAdmin, roleController.updateRole)
roleRouter.delete('/roles/:id', isAdmin, roleController.deleteRole)

export const cityRouter = new Router();
cityRouter.post('/cities/', isAdmin, cityController.createCity)
cityRouter.get('/cities/', isUser, cityController.getCities)
cityRouter.get('/cities/:id', isUser, cityController.getCity)
cityRouter.put('/cities/:id', isAdmin, cityController.updateCity)
cityRouter.delete('/cities/:id', isAdmin, cityController.deleteCity)

export const countryRouter = new Router();
countryRouter.post('/countries/', isAdmin, countryController.createCountry)
countryRouter.get('/countries/', isUser, countryController.getCountires)
countryRouter.get('/countries/:id', isUser, countryController.getCountry)
countryRouter.put('/countries/:id', isAdmin, countryController.updateCountry)
countryRouter.delete('/countries/:id', isAdmin, countryController.deleteCountry)

export const locationRouter = new Router();
locationRouter.post('/locations/', isAdmin, locationController.createLocation)
locationRouter.get('/locations/', locationController.getLocations)
locationRouter.get('/locations/:id', locationController.getLocation)
locationRouter.put('/locations/:id',isAdmin, locationController.updateLocation)
locationRouter.delete('/locations/:id',isAdmin, locationController.deleteLocation)

export const cosmeticBagRouter = new Router();
cosmeticBagRouter.post('/userProducts/', isUser, cosmeticBagController.addProductToCosmeticBag)
cosmeticBagRouter.get('/userProducts/', isUser, cosmeticBagController.getProductsOfUser)
cosmeticBagRouter.get('/userProducts/:id', isUser, cosmeticBagController.getProductOfUser)
cosmeticBagRouter.put('/userProducts/:id', isUser, cosmeticBagController.updateProductOfUser)
cosmeticBagRouter.delete('/userProducts/:id', isUser, cosmeticBagController.deleteProductFromUser)

export const subscriptionRouter = new Router();
subscriptionRouter.post('/subs/', isUser, subscriptionController.subscribeToUser)
subscriptionRouter.get('/subs/', isUser, subscriptionController.getUserSubscriptions)
subscriptionRouter.delete('/subs/:id', isUser, subscriptionController.unfollow)

export const categorySkinTypeRouter = new Router();
categorySkinTypeRouter.post('/categoriesSkinTypes/', categorySkinTypeController.addSkinTypeToCategory)
categorySkinTypeRouter.get('/categoriesSkinTypes/category/:id', isUser, categorySkinTypeController.getCategoriesOfSkinType)
categorySkinTypeRouter.delete('/categoriesSkinTypes/skinType/:id', isUser, categorySkinTypeController.getSkinTypesOfCategory)