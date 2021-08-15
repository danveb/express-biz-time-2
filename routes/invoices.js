const express = require('express')
const ExpressError = require('../expressError')

// adding a new router for /invoices 
const router = new express.Router()  
const db = require('../db')

// GET /invoices 
// SQL: SELECT * FROM invoices; 
router.get('/', async (req, res, next) => {
    try {
        // await db.query (SQL) 
        const results = await db.query(`SELECT * FROM invoices`)
        // return JSON object 
        return res.json({ invoices: results.rows })
    } catch(err) {
        return next(err) 
    }
})

// GET /invoices/:id 
// SQL: SELECT * FROM invoices WHERE id=$1
router.get('/:id', async (req, res, next) => {
    try {
        // extract { id } from req.params
        const { id } = req.params 
        // await db.query (SQL); parameterize to prevent SQL Injection 
        const results = await db.query(`SELECT * FROM invoices WHERE id=$1`, [id])
        // error handling for nonexistent invoice
        if(results.rows.length === 0) {
            throw new ExpressError("Can't find invoice", 404) 
        }
        // return JSON object 
        return res.json({ invoice: results.rows[0] })
    } catch(err) {
        return next(err) 
    }
})

// POST /invoices
// SQL: INSERT INTO invoices (comp_code, amt) VALUES ($1, $2) RETURNING *
router.post('/', async (req, res, next) => {
    try {
        // extract comp_code, amt from req.body 
        const { comp_code, amt } = req.body 
        // await db.query (SQL); parameterize to prevent SQL Injection
        const results = await db.query(`INSERT INTO invoices (comp_code, amt) VALUES ($1, $2) RETURNING *`, [comp_code, amt])
        // return JSON object
        return res.json({ invoice: results.rows[0] })
    } catch(err) {
        return next(err) 
    }
})

// PUT /invoices/:id 
// SQL: UPDATE invoices SET amt=$1 WHERE id=$2 RETURNING * 
router.put('/:id', async (req, res, next) => {
    try {
        // extract id from req.params 
        const { id } = req.params 
        // extract amt from req.body 
        const { amt } = req.body 
        // await db.query (SQL); parameterize to prevent SQL Injection
        const results = await db.query(`UPDATE invoices SET amt=$1 WHERE id=$2 RETURNING *`, [amt, id])
        // error handling for nonexistent invoice
        if(results.rows.length === 0) {
            throw new ExpressError("Can't find invoice", 404) 
        }
        // return JSON object 
        return res.json({ invoice: results.rows[0] })
    } catch(err) {
        return next(err) 
    }
})

// DELETE /invoices/:id 
// SQL: DELETE FROM invoices WHERE id=$1 
router.delete('/:id', async (req, res, next) => {
    try {
        // extract id from req.params 
        const { id } = req.params 
        // await db.query 
        const results = await db.query(`DELETE FROM invoices WHERE id=$1 RETURNING id`, [id])
        // error handling for missing invoice id 
        if(results.rows.length === 0) {
            throw new ExpressError("Can't find invoice id", 404) 
        }
        // send status: "deleted" 
        return res.json({ status: "deleted" })
    } catch(err) {
        return next(err) 
    }
})

module.exports = router 