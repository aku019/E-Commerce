// const express = require('express');
// const path = require('path');
// var genuuid = require('uuid').v4;
// const session = require('express-session');
// const MongoStore = require('connect-mongo');

// const app = express();

// const api = require('./server/api');
// const db = require('./server/db');



// //Configure .env
// require('dotenv').config();

// //Set port as process.env.PORT if it is present otherwise set it to 4000
// const port = process.env.PORT || 4000;

// //Initiate connection with database
// db.connect({
//     host: process.env.DB_HOST,
//     username: process.env.DB_USER,
//     password: process.env.DB_PASS,
//     database: process.env.DB_NAME
// }).then(() => {
//     //Handle /api with the api middleware
//     app.use('/api', session({
//         genid() {
//             return genuuid() // use UUIDs for session IDs
//         },
//         store: new MongoStore({ client: db.getClient() }),
//         secret: process.env.SESSION_SECRET,
//         resave: true,
//         saveUninitialized: false
//     }), api);

//     //Handle non-api routes with static build folder
//     app.use(express.static(path.join(__dirname, 'build')));

//     //Return index.html for routes not handled by build folder
//     app.get('*', function (req, res) {
//     res.sendFile(path.join(__dirname, 'build', 'index.html'));
//     });

//     //Start listening on port
//     app.listen(port, () => {
//         console.log(`Server listening at port: ${port}`);
//     });
// });

const express = require('express');
const api = require('./server/server');
// const { urls }= require('./urls_data.js');
 const router=express.Router();

// const api= require('./api');
const app = express();
// const port =process.env.PORT || 3000;
// app.use(express.json());
// app.use(express.urlencoded({extended:true}));


// ...


app.use('/API',api);

//"concurrently \"npm run server\" \"npm run client\"",

//"dev": "npm start --prefix src",