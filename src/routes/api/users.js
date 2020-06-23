const express=require('express')
const bcrypt=require('bcryptjs');
const gravatar=require('gravatar')
const jwt=require('jsonwebtoken');
const router=express.Router();
require("dotenv").config({ path: "src/.env" });
const {check,validationResult}=require('express-validator/check')
const User=require('../../model/User')

router.post('/',(req,res)=>{
    const {name,email,password}= req.body;

    //Simple validation
    if(!name || !email  || !password){
        return res.status(400)
            .json({msg:'Please enter all fields'});
    }

    // Checks for existing user
    User.findOne({email:email})
        .then(user =>{
            if(user) return res.status(400)
                .json({msg:'User already there'});

            const image=gravatar.url(email,{
                s:'200',
                r:'pg',
                d:'mm'
            })
            const newUser = new User({
                name,
                email,
                password
            });

            // Create salt & hash
            bcrypt.genSalt(10,(err,salt)=>{
                bcrypt.hash(newUser.password,salt,(err,hash)=>{
                    if(err) throw err;
                    newUser.password = hash;
                    newUser.save()
                        .then(user =>{

                            jwt.sign(
                                { name:user.name},
                                process.env.JWT_SECRET,
                                {expiresIn:3600},
                                (err,token)=>{
                                    if(err) throw err;

                                    res.json({
                                        token:token,
                                        user:{
                                            id:user.id,
                                            name:user.name,
                                            email:user.email
                                        }
                                    })


                                }
                            )


                        })
                })
            })
        })

});


module.exports=router;
