const express = require('express')
const router = express.Router()

//Conexión a la base de datos
const pool  = require('../database')
const {isLoggedIn} = require('../lib/auth');

router.use(isLoggedIn);

router.get('/add', (req, res) => {
    res.render('links/add')
})

router.post('/add', async (req, res) => {
    console.log(req.body)
    const newLink = {
        ...req.body,
        user_id: req.user.id
    };
    console.log(req.user.id)
    await pool.query('INSERT INTO links SET ?', [newLink])
    req.flash('success', 'Link saved successfully')
    res.redirect('/links');
})

router.get('/',  async (req, res) => {
    console.log(req.user.id)
    const [rows] = await pool.query('SELECT * FROM links WHERE user_id = ?', [req.user.id]);
    res.render('links/list', {links: rows});
})

router.get('/delete/:id', async (req, res) => {
    console.log(req.user.id)
    const {id} = req.params
    const [rows] = await pool.query('DELETE FROM links WHERE ID=? AND user_id=?', [id, req.user.id])
    console.log(rows)
    if(rows.affectedRows !== 0)
        req.flash('success', 'Link removed successfully')
    else
        req.flash('failure', 'Link doesn\'t exist')

    res.redirect('/links');
})

router.get('/edit/:id', async (req, res) => {
    const {id} = req.params
    const [rows] = await pool.query('SELECT * FROM links WHERE id=? AND user_id=?', [id, req.user.id])
    console.log(rows)
    if (rows.length !== 0)
        res.render('links/edit', {link: rows[0]})
    else{
        req.flash('failure', 'Link doesn\'t exist')
        res.redirect('/links')
    }
        
})

router.post('/edit/:id', async (req, res) => {
    const {id} = req.params;
    const newLink = {...req.body}
    console.log(newLink)
    await pool.query('UPDATE links SET ? WHERE id=?', [newLink, id]);
    req.flash('success', 'Link updated successfully')
    res.redirect("/links")
})

module.exports = router;