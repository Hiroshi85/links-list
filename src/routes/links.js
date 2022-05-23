const express = require('express')
const router = express.Router()

//Conexión a la base de datos
const pool  = require('../database')
const {isLoggedIn} = require('../lib/auth');

//CSRF
const {generateCsrf, validateCsrf} = require('../lib/csrf');

router.use(isLoggedIn);

router.get('/add', generateCsrf, (req, res) => {
    const csrf_token = req.session.csrf;
    res.render('links/add', {csrf_token});
})

router.post('/add', validateCsrf, async (req, res) => {
    console.log(req.body);
    const {csrf_token, ...linkBody} = req.body;
    const newLink = {
        ...linkBody,
        user_id: req.user.id
    };
    await pool.query('INSERT INTO links SET ?', [newLink])
    req.flash('success', 'Link saved successfully')
    res.redirect('/links');
})

router.get('/',  async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM links WHERE user_id = ?', [req.user.id]);
    res.render('links/list', {links: rows});
})

router.get('/delete/:id', async (req, res) => {
    const {id} = req.params
    const [rows] = await pool.query('DELETE FROM links WHERE ID=? AND user_id=?', [id, req.user.id])
    if(rows.affectedRows !== 0)
        req.flash('success', 'Link removed successfully')
    else
        req.flash('failure', 'Link doesn\'t exist')

    res.redirect('/links');
})

router.get('/edit/:id', generateCsrf, async (req, res) => {
    const csrf_token = req.session.csrf;
    const {id} = req.params
    const [rows] = await pool.query('SELECT * FROM links WHERE id=? AND user_id=?', [id, req.user.id])
    if (rows.length !== 0)
        res.render('links/edit', {link: rows[0], csrf_token})
    else{
        req.flash('failure', 'Link doesn\'t exist')
        res.redirect('/links')
    }
        
})

router.post('/edit/:id', validateCsrf, async (req, res) => {
    const {id} = req.params;
    console.log(req.body)
    const {csrf_token, ...newLink} = req.body
    console.log(newLink)
    await pool.query('UPDATE links SET ? WHERE id=?', [newLink, id]);
    req.flash('success', 'Link updated successfully')
    res.redirect("/links")
})

module.exports = router;