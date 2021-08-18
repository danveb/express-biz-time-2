// // set environment variable (test) 
// process.env.NODE_ENV = 'test' 

// // SUPERTEST test function 
// const request = require('supertest') 
// const { response } = require('express')
// const app = require('../app')
// const db = require('../db') 

// // initialize testCompany
// let testCompany; 

// // // beforeEach (async function db.query)
// beforeEach(async () => {
//     // hardcode a company
//     const result = await db.query(`
//     INSERT INTO companies (code, name, description) VALUES ('google', 'Google', 'Number 1') RETURNING code, name, description`)
//     testCompany = result.rows[0]
// })

// // afterEach (async)
// afterEach(async () => {
//     // empty out after each test finishes
//     await db.query(`DELETE FROM companies`)
// })

// // afterAll (stop connection to db) 
// afterAll(async () => {
//     await db.end() 
// })

// // Test /GET /companies -> follow async per companies.js routes
// describe('GET /companies', () => {
//     test('Get a list with one company', async () => {
//         const res = await request(app)
//             .get('/companies') 
//         // expectation 
//         expect(res.statusCode).toBe(200) 
//         expect(res.body).toEqual({companies : [testCompany]})
//     })
// })

// // Test /GET /companies/:code
// describe('GET /companies/:code', () => {
//     test('Get company by code', async () => {
//         const res = await request(app)
//             .get(`/companies/${testCompany.code}`)
//         // expectation 
//         expect(res.statusCode).toBe(200) 
//         expect(res.body).toEqual({company: testCompany})
//     })
// })

// // Test /POST /companies 
// describe('POST /companies', () => {
//     test('Create a company', async () => {
//         const res = await request(app)
//             .post('/companies')
//             .send({code: 'facebook', name: 'Facebook', description: 'Social Network'})
//         // expectation 
//         expect(res.statusCode).toBe(201) 
//         expect(res.body).toEqual({
//             company: {
//                 code: 'facebook', 
//                 name: 'Facebook', 
//                 description: 'Social Network'
//             }
//         })
//     })
// })

// // Test /PUT /companies/:id 
// describe('PUT /companies/:id', () => {
//     test('Update a company', async () => {
//         const res = await request(app) 
//             .put(`/companies/${testCompany.code}`)
//             .send({name: 'Google', description: 'Googlicious'})
//         expect(res.statusCode).toBe(200)
//     })
// })

// // Test /DELETE /companies/:id 
// describe('DELETE /companies/:id', () => {
//     test('Delete a company', async () => {
//         const res = await request(app)
//             .delete(`/companies/${testCompany.code}`)
//         expect(res.statusCode).toBe(200) 
//         expect(res.body).toEqual({status:'deleted'})
//     })
// })