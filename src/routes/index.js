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

router.get('/jobs', async(req, res) => {
    const query = `SELECT "J"."Id", "J"."Title", CONCAT("J"."PayRangeStart",' - ',"J"."PayRangeEnd") AS "Pay", "J"."Location"
FROM "public"."Company" AS "C"
INNER JOIN "public"."Job" AS "J"
ON "C"."Id" = "J"."CompanyId"
ORDER BY "J"."Id" DESC`
const results = await dbClient.query(query);
const jobs = results.rows;
res.render('jobs', {title: 'All Jobs', jobs})
});


export default router;