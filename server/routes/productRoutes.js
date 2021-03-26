import express from 'express';
import { createRequire } from 'module';
import { Console } from 'console'
 const require = createRequire(import.meta.url);
 const app = express();
var cors = require('cors');
app.use(cors());
const router = express.Router()
import {getProducts, getProductById, deleteProduct, createProduct, updateProduct, createProductReview, getTopProducts} from '../controllers/productController.js'
import {protect, admin} from '../middleware/authMiddleware.js'

router.route('/').get(getProducts).post(protect, admin, createProduct);
router.route('/:id/reviews').post(protect, createProductReview);
router.get('/top', getTopProducts);
console.log("routes");
router.route('/:id').get(getProductById).delete(protect, admin, deleteProduct).put(protect, admin, updateProduct)


export default router;