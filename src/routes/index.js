import { Router } from 'express';

const router = Router();
 
// The home page route
router.get('/', async (req, res) => {
    res.render('index', { title: 'Home Page' });
});

router.get('/contact', async (req, res) => {
    res.render('contact', {title: 'Contact Page'})
});

router.get('/login-register', async (req, res) => {
    res.render('login-register', {title: 'Login/Register'})
});

export default router;