import { Router } from "express";
import { checkExistingUser, addNewUser, verifyUser, getCompanyTypes, createNewCompany, createNewJob, getUserCompanies, getJustCompanies, getAllJobs, deleteJobById } from "../../models/company/index.js";

const router = Router();

router.get('/login-register', async (req, res) => {
    req.session.isAuthorized = false;
    req.session.user = undefined;
    req.session.role = undefined;
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

// This route will check the credentials and login in the user and also sets the session data like some user details that are necessary for other routes to function
router.post('/login', async (req, res) => {
    const email = req.body.u_email;
    const password = req.body.u_pass;
    const result = await verifyUser(email, password);
    if(result != undefined){
        req.session.isAuthorized = true;
        req.session.user = result.Id;
        req.session.role = 'company';
        res.redirect('/company/dashboard');
    }else{
        req.flash("error", "Wrong Credentials/User does not exist");
        res.redirect('/company/login-register');
    };
});

// This route is the main page which is shown upon logging in
router.get('/dashboard', async(req, res) => {
    if(req.session.isAuthorized == true && req.session.role == 'company' && req.session.user){
        const companies = await getUserCompanies(req.session.user);
        const jobs = await getAllJobs(req.session.user);
        console.log(jobs);
        res.render('company/dashboard', {title : "Company Dashboard", companies, jobs});
    }
    else{
        req.flash("Error", "Please login");
        res.redirect('/company/login-register');
    }
});
// This is the page which can be access after logging in which also have forms to create new data
router.get('/settings', async(req, res) => {
    if(req.session.isAuthorized == true && req.session.role == 'company'){
        const companyTypes = await getCompanyTypes();
        const justCompanies = await getJustCompanies(req.session.user);
        res.render('company/settings', {title : "Company Settings", companyTypes, justCompanies});
    }
    else{
        req.flash("Error", "Please login");
        res.redirect('/company/login-register');
    };
});

router.post('/signout', async(req, res) => {
    req.session.isAuthorized = false;
    req.session.user = undefined;
    req.session.role = undefined;
    res.redirect('/company/login-register');
});

// This route is accessed from dashboard and is used to create new companies for a user
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

router.post('/create/job', async(req, res) => {
    const title = req.body.j_title;
    const pay_start = parseFloat(req.body.j_pay_start);
    const pay_end = parseFloat(req.body.j_pay_end);
    const description = req.body.j_description;
    const location = req.body.j_location;
    const company = req.body.j_company;
    if(!isNaN(pay_start) && !isNaN(pay_end)){
        console.log("Working");
        await createNewJob(title, pay_start, pay_end, description, location, company);
        req.flash("success", "You Created a New Job");
        res.redirect('/company/dashboard');
    }else{
        req.flash("error", "Please Only Add Numeric Values for Payrange");
        res.redirect('/company/settings');
    }
});

router.post('/delete/job', async(req, res) => {
    const jobId = req.body.j_id;
    await deleteJobById(jobId);
    res.redirect('/company/dashboard');
});

export default router;