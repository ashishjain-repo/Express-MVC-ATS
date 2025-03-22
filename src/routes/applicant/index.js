import { Router } from "express";
import { checkExistingUser, addNewUser, verifyUser, getUserDetails, updateData, allAvailableJobs, applyForJob, getAppliedJobs, withdrawApplication } from "../../models/applicant/index.js";

const router = Router();

router.get('/login-register', async (req, res) => {
    req.session.user = undefined;
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
    if (result == undefined) {
        req.flash("error", "Wrong Credentials/Applicant does not exist");
        res.redirect('/applicant/login-register');
    }
    else if (result.Id > 0) {
        req.session.isAuthorized = true;
        req.session.applicant = result.Id;
        req.session.role = 'applicant';
        res.redirect('/applicant/dashboard');
    }
});

router.post('/signout', async(req, res) => {
    req.session.isAuthorized = false;
    req.session.applicant = undefined;
    req.session.role = undefined;
    res.redirect('/applicant/login-register');
});

// Upon Login Views
router.get('/dashboard', async (req, res) => {
    console.log(req.session);
    if (req.session.isAuthorized == true && req.session.role == 'applicant' && req.session.applicant) {
        const result = await getUserDetails(req.session.applicant);
        const user = result.rows[0];
        const jobsArr = await getAppliedJobs(req.session.applicant);
        const jobs = jobsArr.rows;
        console.log(jobs);
        res.render('applicant/dashboard', { title: "Applicant Dashboard", user, jobs });
    }
    else {
        req.flash("error", "Please login");
        res.redirect('/applicant/login-register');
        console.log("Error");
    }
});

router.get('/settings', async (req, res) => {
    if (req.session.isAuthorized == true && req.session.role == 'applicant') {
        const result = await getUserDetails(req.session.applicant);
        const user = result.rows[0];
        console.log(user);
        res.render('applicant/settings', { title: "Applicant Settings", user });
    }
    else {
        req.flash("error", "Please login");
        res.redirect('/applicant/login-register');
        console.log("Error");
    }
});

router.get('/jobs', async(req, res) => {
    if (req.session.isAuthorized == true && req.session.role == 'applicant') {
        const result = await getUserDetails(req.session.applicant);
        const user = result.rows[0];
        const allJobs = await allAvailableJobs(req.session.applicant);
        const jobs = allJobs.rows;
        console.log(jobs);
        res.render('applicant/jobs', { title: "Applicant Jobs", user, jobs });
    }
    else {
        req.flash("error", "Please login");
        res.redirect('/applicant/login-register');
        console.log("Error");
    }
})

router.post('/update', async(req, res) => {
    try{
        const column = req.body.u_choice;
        const data = req.body.u_detail;
        const user = req.session.applicant;
        if(column == "Phone"){
            if(isNaN(data)){
                console.log('Works');
                req.flash("error", "Please add valid number");
                throw new Error();
            }
            await updateData(column, parseInt(data), user);
        }else{
            await updateData(column, data, user);
        }
        res.redirect('/applicant/dashboard');
    }catch(err){
        req.flash("error", "Unable to update");
        res.redirect('/applicant/dashboard');
    }
});

router.post('/job/apply', async(req, res) => {
    const jobId = req.body.j_id;
    await applyForJob(jobId, req.session.applicant);
    req.flash("success", "Congrats! You have Applied for a job.");
    res.redirect('/applicant/jobs');
});

router.post('/job/withdraw', async(req, res) => {
    const jobApplicantId = req.body.ja_id;
    await withdrawApplication(jobApplicantId);
    req.flash("success","Application Withdrawn");
    res.redirect("/applicant/dashboard");
});

export default router;