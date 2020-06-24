const express=require('express');
const router=express.Router();
const Profile=require('../../model/Profile')
const User=require('../../model/User')
const auth=require('../../middleware/auth')
const {check,validationResult}=require('express-validator')



router.get('/check',auth, async (req,res)=> {
try{
    const profile=await Profile.findOne({user:req.user.id})
        .populate('user',['name','image']);

if(!profile){
    return res.status(400).json({msg:'Ther   No profile'})
}

}catch(err){
    console.error(err.message);
    res.status(500).send('DEAD');
}
})

router.post('/',[auth,

        [
            check('status','Status is required').not().isEmpty(),
            check('skills','Status is required').not().isEmpty()

        ]]

,async (req,res)=>{

    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    const{
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    }=req.body;
    //build profile ob

        const profileFields={};

        try {

            const check1=await User.findOne({user:req.user.id})

            profileFields.user = check1;
            if (company) profileFields.company = company;
            if (website) profileFields.website = website;
            if (bio) profileFields.bio = bio;
            if (status) profileFields.status = status;
            if (githubusername) profileFields.githubusername = githubusername;
            if (skills) {
                profileFields.skills = skills.split(',').map(skill => skill.trim())
            }

        }catch(err){

            console.error(err.message)
        }

        profileFields.social={};

        if(youtube)profileFields.youtube=youtube;
        if(facebook)profileFields.facebook=facebook;
        if(instagram)profileFields.instagram=instagram;
        if(twitter)profileFields.twitter=twitter;
        if(linkedin)profileFields.linkedin=linkedin;


        try{
            let profile=await Profile.findOne({user:req.user.id})

            if(profile){
                //update
                profile=await Profile.findOneAndUpdate({user:req.user.id},
                    {$set:profileFields},
                        {new:true}
                )
                return res.json(profile)
            }

            profile=new Profile(profileFields)

            await profile.save();
            res.json(profile)


        }catch(err){
            console.error(err.message);
            res.status(500).send('Dedd')
            console.log(profileFields.social);
            res.send('Heelo')
        }






    }

);



module.exports=router;
