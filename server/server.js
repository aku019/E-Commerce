import path from 'path'
import express from 'express' 
import dotenv from 'dotenv'
import colors from 'colors'
import morgan from 'morgan'
import connectDB from './config/db.js'
import {notFound, errorHandler} from './middleware/errorMiddleware.js'

import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'

import { createRequire } from 'module';
import { Console } from 'console'
 const require = createRequire(import.meta.url);

var cors = require('cors');
//app.use(cors());
 // Use this after the variable declaration

// import MongoStore from 'connect-mongo';
//const db = require('./db');

// import db from './db.js'
dotenv.config()
//require('dotenv').config();
// db.connect({
//          host: process.env.DB_HOST,
//          username: process.env.DB_USER,
//          password: process.env.DB_PASS,
//          database: process.env.DB_NAME
//      })

   connectDB();
// connectDB({
//      host: process.env.DB_HOST,
//      username: process.env.DB_USER,
//      password: process.env.DB_PASS,
//      database: process.env.DB_NAME
//  });
const app = express();
app.use(cors());
//Console.LOG("HERE");
console.log("HERE");

if(process.env.NODE_ENV === 'developement'){
    app.use(morgan('dev'))
}

app.use(express.json()) ;

app.use('/api/products', productRoutes)
console.log('in server')
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)

app.get('/api/config/paypal', (req, res)=> res.send(process.env.PAYPAL_CLIENT_ID))

const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, '/src/build')))
    
    app.get('*', (req, res)=> res.sendFile(path.resolve(__dirname, 'src', 'build', 'index.html')))  
} else {
    app.get('/', (req,res)=>{
        res.send('API is running...')
    })
}


app.use(notFound)
app.use(errorHandler)

 
const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold))