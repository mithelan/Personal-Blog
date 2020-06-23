const express=require('express');
const router=express.Router();
const auth=require('../../middleware/auth')
const User=require('../../model/User')
const bcrypt=require('bcryptjs');
const gravatar=require('gravatar')
const jwt=require('jsonwebtoken');

router.get('/',auth,async (req,res)=>{

    try{
        const user=await User.findById(req.user.id).select('-password');
        res.json(user);

    }catch(err){

        console.error(err.message);
        res.status(500).send('Server pochu')
    }
});


router.post("/", (req, res) => {
    const { email, password } = req.body;

    //Simple validation
    if (!email || !password) {
        return res.status(400).json({ msg: "Please enter all fields" });
    }

    // Checks for existing user
    User.findOne({ email: email }).then((user) => {
        if (!user) return res.status(400).json({ msg: "User does not exist" });

        // validate password
        bcrypt.compare(password, user.password).then((isMatch) => {
            if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

            jwt.sign(
                { id: user.id },
                process.env.JWT_SECRET,
                { expiresIn: 3600 },
                (err, token) => {
                    if (err) throw err;

                    res.json({
                        token: token,
                        user: {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                        },
                    });
                }
            );
        });
    });
});



module.exports=router;
