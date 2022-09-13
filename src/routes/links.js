const express = require('express')
const router = express.Router()

//Conexión a la base de datos
const pool  = require('../database')
const {isLoggedIn} = require('../lib/auth');
const {index, create, store, edit, update, destroy} = require('../controllers/links');

//CSRF
const {generateCsrf, validateCsrf} = require('../lib/csrf');

router.use(isLoggedIn);

router.get('/', generateCsrf, index);

router.get('/add', generateCsrf, create);

router.post('/add', validateCsrf, store);

router.get('/edit/:id', generateCsrf, edit);

router.put('/edit/:id', validateCsrf, update);

router.delete('/delete/:id', validateCsrf, destroy);

module.exports = router;