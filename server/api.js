const express = require('express');
const router = express.Router();

const users = require('./routes/users');
const sessions = require('./routes/sessions');

// Add json and urlencoded middleware
var cors = require('cors');
app.use(cors());
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

console.log('in utils routes')
router.use('/users', users);

router.use('/sessions', sessions);

module.exports = router;