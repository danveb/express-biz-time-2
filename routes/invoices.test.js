// set environment variable (test) 
process.env.NODE_ENV = 'test' 

// SUPERTEST test function 
const request = require('supertest') 
const { response } = require('express')
const app = require('../app')
const db = require('../db') 

// afterAll (stop connection to db) 
afterAll(async () => {
    await db.end() 
})

// id, comp_Code, amt, paid, add_date, paid_date

// Test /GET /invoices -> follow async per invoices.js routes
describe('GET /invoices', () => {
    test('Get a list with one invoice', async () => {
        const res = await request(app)
            .get('/invoices') 
        // expectation 
        expect(res.statusCode).toBe(200) 
        expect(res.body).toEqual({invoices : [
            {
                id: expect.any(Number), // allow any Number
                comp_code: 'apple', 
                amt: 100, 
                add_date: expect.any(String), // allow any String
                paid: false, 
                paid_date: null
            },
            {
                id: expect.any(Number), // allow any Number
                comp_code: 'apple', 
                amt: 200, 
                add_date: expect.any(String), // allow any String
                paid: false, 
                paid_date: null
            },
            {
                id: expect.any(Number), // allow any Number
                comp_code: 'apple', 
                amt: 300, 
                add_date: expect.any(String), // allow any String
                paid: true, 
                paid_date: expect.any(String) // allow any String
            },
            {
                id: expect.any(Number), // allow any Number
                comp_code: 'ibm', 
                amt: 400, 
                add_date: expect.any(String), // allow any String
                paid: false, 
                paid_date: null
            },
        ]})
    })
})

// Test /GET /invoices/:code
describe('GET /invoices/:id', () => {
    test('Get company by id', async () => {
        const res = await request(app)
            // test with id: 1
            .get(`/invoices/1`)
        // expectation 
        expect(res.statusCode).toBe(200) 
        expect(res.body).toEqual({invoice: {
            id: expect.any(Number), // allow any Number
            comp_code: 'apple', 
            amt: 100, 
            add_date: expect.any(String), // allow any String
            paid: false, 
            paid_date: null
        }})
    })
})

// Test /POST /invoices 
// comp_Code, amt, paid, add_date, paid_date
describe('POST /invoices', () => {
    test('Create an invoice', async () => {
        const res = await request(app)
            .post('/invoices')
            .send({
                comp_code: 'ibm', 
                amt: 500, 
            })
        // expectation 
        expect(res.statusCode).toBe(201) 
        expect(res.body).toEqual({
            invoice: {
                id: expect.any(Number), // allow any Number
                comp_code: 'ibm', 
                amt: 500, 
                add_date: expect.any(String), // allow any String
                paid: false, 
                paid_date: null
            }
        })
    })
})

// Test /PUT /invoices/:id 
describe('PUT /invoices/:id', () => {
    test('Update an invoice', async () => {
        const res = await request(app) 
            .put(`/invoices/1`)
            .send({
                amt: 150, 
            })
        expect(res.statusCode).toBe(200)
    })
})

// Test /DELETE /invoices/:id 
describe('DELETE /invoices/', () => {
    test('Delete an invoice', async () => {
        const res = await request(app)
            .delete(`/invoices/6`)
        expect(res.statusCode).toBe(200) 
        expect(res.body).toEqual({status:'deleted'})
    })
})