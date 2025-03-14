import { Router } from "express";
import { checkExistingUser } from "../../models/account/index.js";


const router = Router();

router.post('/register' , async (req, res) => {
    const email = req.body.c_email;
    const result = await checkExistingUser(email);
    if(result.rowCount < 1){
        
    }else{
        req.flash("error", "User with provided credentials exists");
        res.redirect('/login-register')
    };
});

export default router;