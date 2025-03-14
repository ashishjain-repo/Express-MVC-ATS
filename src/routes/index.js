import { Router } from 'express';
import dbClient from '../models/index.js';

const router = Router();
 
// The home page route
router.get('/', async (req, res) => {
    res.render('index', { title: 'Home Page' });
});

router.get('/contact', async (req, res) => {
    res.render('contact', {title: 'Contact Page'})
});

router.post('/contact', async(req, res) => {
    const query = `INSERT INTO "Contact" ("Name", "Email", "Message") VALUES ($1, $2, $3)`;
    const fields = [req.body.user_name, req.body.user_email, req.body.user_message];
    await dbClient.query(query, fields);
    res.redirect('/');
});

router.get('/login-register', async (req, res) => {
    const query = 'SELECT "Id", "Type" FROM "public"."CompanyType"';
    const companyType = await dbClient.query(query);
    res.render('login-register', {title: 'Login/Register', companyType});
});

router.post('/login-register/register', async(req, res) => {
    const query = `INSERT INTO "Company" () VALUES ()`
})

export default router;