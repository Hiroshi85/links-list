const express = require('express')
const router = express.Router()

const notFound = (req, res) =>{
    res.status(404).render('notfound', {url: req.originalUrl})
}

module.exports = notFound;