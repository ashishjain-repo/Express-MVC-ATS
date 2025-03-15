import { Router } from "express";
import { checkExistingUser, addNewUser, verifyUser, getUserDetails} from "../../models/applicant/index.js";

const router = Router();

router.get('/login-register', async (req, res) => {
    res.render('applicant/login-register', { title: "Login/Register" })
});

router.post('/register', async (req, res) => {
    const fname = req.body.u_fname;
    const lname = req.body.u_lname;
    const gender = req.body.u_gender;
    const email = req.body.u_email;
    const password = req.body.u_pass;
    const result = await checkExistingUser(email);
    if (result.rowCount > 0) {
        req.flash("error", "Applicant with provided credentials exists");
    } else {
        if (password !== req.body.u_pass_re) {
            req.flash("error", "Password do not match");
        } else {
            req.flash("success", "Applicant Successfully Added");
            await addNewUser(fname, lname, gender, email, password);
        }
    };
    res.redirect('/applicant/login-register')
});


router.post('/login', async (req, res) => {
    const email = req.body.u_email;
    const password = req.body.u_pass;
    const result = await verifyUser(email, password);
    console.log(result);
    if (result == undefined) {
        req.flash("error", "Wrong Credentials/Applicant does not exist");
        res.redirect('/applicant/login-register');
    }
    else if (result.Id > 0) {
        req.session.isAuthorized = true;
        req.session.applicant = result.Id;
        res.redirect('/applicant/dashboard');
    }
    });

router.get('/dashboard', async (req, res) => {
    if (req.session.isAuthorized == true) {
        const result = await getUserDetails(req.session.applicant);
        const user = result.rows[0];
        console.log(user);
        res.render('applicant/dashboard', { title: "Applicant Dashboard", user });
    }
    else {
        req.flash("Error", "Please login");
        res.redirect('/applicant/login-register');
        console.log("Error");
    }
});

router.post('/signout', async(req, res) => {
    req.session.isAuthorized = false;
    req.session.applicant = undefined;
    res.redirect('/applicant/login-register');
});

export default router;