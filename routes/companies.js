const express = require('express')
const ExpressError = require('../expressError')
const router = express.Router() 
const db = require('../db')
const slugify = require('slugify') 

// GET /companies 
// SQL: SELECT * FROM companies; 
router.get('/', async (req, res, next) => {
    // try/catch 
    try {
        // async db.query (SQL)
        const results = await db.query(`SELECT * FROM companies`) 
        // return JSON object of all companies 
        return res.json({ companies: results.rows })
    } catch(err) {
        return next(err) 
    }
})

// GET /companies/:code 
// SQL: SELECT * FROM companies WHERE code='apple';
router.get('/:code', async (req, res, next) => {
    try {
        // extract { code } from req.params 
        const { code } = req.params 
        // await db.query (SQL) 
        // make sure to parameterize ($1) to prevent SQL Injection
        const results = await db.query(`SELECT * FROM companies WHERE code=$1`, [code])
        // error handling for company code
        if(results.rows.length === 0) {
            throw new ExpressError("Can't find company", 404) 
        }
        // return JSON object 
        return res.json({company: results.rows[0]})
    } catch(err) {
        return next(err) 
    }
})

// POST /companies
// SQL: INSERT INTO companies VALUES (code, name, description) RETURNING * 
router.post('/', async (req, res, next) => {
    try {
        // extract code, name, description from req.body 
        const { code, name, description } = req.body 
        // await db.query (SQL); return *
        // parameterize ($1, $2, $3) to prevent SQL Injection 
        const results = await db.query(`INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING code, name, description`, [code, name, description])
        return res.status(201).json({company: results.rows[0]})
    } catch(err) {
        return next(err) 
    }
})

// PUT /companies/:code
// Note: The difference between PUT and PATCH is that PUT must update all fields to make it idempotent. This fancy word basically means that you must always get the same result no matter how many times it is executed. This is important in network traffic, because if you’re in doubt whether your request has been lost during transmission, you can just send it again without worrying about messing up the resource’s data.
// SQL: UPDATE companies SET name=$1 description=$2 WHERE code=$3 RETURNING * 

// Add slugify 
router.put('/:code', async (req, res, next) => {
    try {
        // extract code from req.params
        const { code } = req.params
        // extract name, description from req.body 
        const { name, description } = req.body 
        // await db.query (SQL); return *
        // parameterize ($1, $2, $3) to prevent SQL Injection 
        const results = await db.query(`UPDATE companies SET name=$1, description=$2 WHERE code=$3 RETURNING code, name, description`, [name, description, slugify(name, {lower:true})])
        return res.send({company: results.rows[0]})
    } catch(err) {
        return next(err) 
    }
})

// DELETE /companies/:code 
// SQL: DELETE FROM companies WHERE code=$1
router.delete('/:code', async (req, res, next) => {
    try {
        // extract code from req.params 
        const { code } = req.params 
        // db.query 
        const results = await db.query(`DELETE FROM companies WHERE code=$1 RETURNING code`, [code])
        // error handling for missing company code
        if(results.rows.length === 0) {
            throw new ExpressError("Can't find company", 404) 
        }
        // send status: "deleted"
        return res.json({status: 'deleted'})
    } catch(err) {
        return next(err) 
    }
})

module.exports = router 