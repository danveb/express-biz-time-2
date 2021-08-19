const express = require('express')
const ExpressError = require('../expressError')
const router = express.Router() 
const db = require('../db')
const slugify = require('slugify') 

// GET /industries/:code
router.get('/:code', async (req, res, next) => {
    try {
        // async db.query (SQL)
        // 1st request for industriesResults 
        // SQL: SELECT * FROM industries; 
        const industriesResults = await db.query(`SELECT * FROM industries`)
        // 2nd request for companiesResults 
        // SQL (JOIN): SELECT code, name, ind_code FROM companies_industries JOIN companies ON comp_code=code WHERE code=apple
        const results = await db.query(`SELECT code, name, ind_code FROM companies_industries JOIN companies ON comp_code=code WHERE code=$1`, [req.params.code])
        const { code, name } = results.rows[0]
        const ind_code = results.rows.map(row => row.ind_code)
        return res.json({ code, name, ind_code })

    } catch(err) {
        return next(err) 
    }
})

// POST /industries/
// router.post('/', async (req, res, next) => {
//     try {
//         // SQL: INSERT INTO industries (code, industry) VALUES ('staff', 'Staffing') 
//         const { code, industry } = req.body 
//         const results = await db.query(`INSERT INTO industries (code, industry) VALUES (code=$1, industry=$2)`, [code, industry])
//         return res.json({ industry: results.rows[0] })
//     } catch(err) {
//         return next(err) 
//     }
// })

// POST /industries 
router.post('/', async (req, res, next) => {
    try {
        // extract code, industry 
        const { code, industry } = req.body 
        const results = await db.query(`INSERT INTO industries (code, industry) VALUES ($1, $2) RETURNING code, industry`, [code, industry]) 
        return res.json({industry: results.rows[0]})
    } catch(err) {
        return next(err) 
    }
})

// PUT /industries/:code 
router.put('/:code', async (req, res, next) => {
    try {
        // extract code from req.params 
        const { code } = req.params 
        const { industry } = req.body 
        const results = await db.query(`UPDATE industries SET industry=$1 WHERE code=$2 RETURNING * `, [industry, code]) 
        return res.json({ industry: results.rows[0] })
    } catch(err) {
        return next(err) 
    }
})

// DELETE /industries/:code 
router.delete('/:code', async (req, res, next) => {
    try {
        const { code } = req.params 
        const results = await db.query(`DELETE FROM industries WHERE code=$1 RETURNING code`, [code])
        return res.json({ status: "deleted" })
    } catch(err) {
        return next(err) 
    }
})

module.exports = router; 