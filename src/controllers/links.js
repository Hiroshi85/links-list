const express = require('express');
const pool  = require('../database');

const index =  async (req, res) => {
    const csrf = req.session.csrf;
    const [rows] = await pool.query('SELECT * FROM links WHERE user_id = ?', [req.user.id]);
    rows.forEach(row => {
        row.csrf = csrf;
    });
    return res.render('links/list', {links: rows});
};

const create = (req, res) => {
    const csrf_token = req.session.csrf;
    return res.render('links/add', {csrf_token});
};

const store = async (req, res) => {
    console.log(req.body);
    const {csrf_token, ...linkBody} = req.body;
    const newLink = {
        ...linkBody,
        user_id: req.user.id
    };
    await pool.query('INSERT INTO links SET ?', [newLink])
    req.flash('success', 'Link saved successfully')
    return res.redirect('/links');
};

const edit = async (req, res) => {
    const csrf_token = req.session.csrf;
    const {id} = req.params
    const [rows] = await pool.query('SELECT * FROM links WHERE id=? AND user_id=?', [id, req.user.id])
    if (rows.length !== 0)
        return res.render('links/edit', {link: rows[0], csrf_token})
    
    req.flash('failure', 'Link doesn\'t exist')
    return res.redirect('/links');
};

const update = async (req, res) => {
    const {id} = req.params;
    console.log(req.body)
    const {csrf_token, ...newLink} = req.body
    console.log(newLink)
    await pool.query('UPDATE links SET ? WHERE id=?', [newLink, id]);
    req.flash('success', 'Link updated successfully');

    return res.redirect("/links");
};

const destroy = async (req, res) => {
    const {id} = req.params
    const [rows] = await pool.query('DELETE FROM links WHERE ID=? AND user_id=?', [id, req.user.id])
    if(rows.affectedRows !== 0)
        req.flash('success', 'Link removed successfully')
    else
        req.flash('failure', 'Link doesn\'t exist')

    return res.redirect('/links');
};

module.exports = {
    index,
    create,
    store,
    edit,
    update,
    destroy
};