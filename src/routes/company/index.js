import { Router } from "express";
import { checkExistingUser, addNewUser, verifyUser, getCompanyTypes, createNewCompany, createNewJob, getUserCompanies, getJustCompanies } from "../../models/company/index.js";

const router = Router();

router.get('/login-register', async (req, res) => {
    res.render('company/login-register', {title: 'Login/Register'});
});

router.post('/register' , async (req, res) => {
    const fname = req.body.u_fname;
    const lname = req.body.u_lname;
    const email = req.body.u_email;
    const password = req.body.u_pass;
    const result = await checkExistingUser(email);
    if(result.rowCount > 0){
        req.flash("error", "User with provided credentials exists");
    }else{
        if(password !== req.body.u_pass_re){
            req.flash("error", "Password do not match");
        }else{
            req.flash("success","User Successfully Added");
            await addNewUser(fname, lname, email, password);
        }
    };
    res.redirect('/company/login-register')
});

router.post('/login', async (req, res) => {
    const email = req.body.u_email;
    const password = req.body.u_pass;
    const result = await verifyUser(email, password);
    console.log(result);
    if(result > 0){
        req.session.isAuthorized = true;
        req.session.user = result;
        req.session.role = 'company';
        res.redirect('/company/dashboard');
    }else{
        req.flash("error", "Wrong Credentials/User does not exist");
        res.redirect('/company/login-register');
    };
});

router.get('/dashboard', async(req, res) => {
    if(req.session.isAuthorized == true && req.session.role == 'company'){
        const companies = await getUserCompanies(req.session.user);
        res.render('company/dashboard', {title : "Company Dashboard", companies});
    }
    else{
        req.flash("Error", "Please login");
        res.redirect('/company/login-register');
        console.log("Error");
    }
});

router.get('/settings', async(req, res) => {
    if(req.session.isAuthorized == true && req.session.role == 'company'){
        const companyTypes = await getCompanyTypes();
        const justCompanies = await getJustCompanies(req.session.user);
        res.render('company/settings', {title : "Company Settings", companyTypes, justCompanies});
    }
    else{
        req.flash("Error", "Please login");
        res.redirect('/company/login-register');
        console.log("Error");
    }
})

router.post('/signout', async(req, res) => {
    req.session.isAuthorized = false;
    req.session.user = undefined;
    res.clearCookie('sessionId');
    res.redirect('/company/login-register');
});

router.post('/create', async(req, res) => {
    const company = req.body.c_name;
    const companyType = req.body.c_type;
    const userId = req.session.user;
    try{
        createNewCompany(company, companyType, userId);
        req.flash("success", "New Company Created");
    }catch(err){
        req.flash("error", "Unable to create a new Company");
    }
    res.redirect('/company/dashboard');
});


export default router;