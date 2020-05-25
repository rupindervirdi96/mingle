const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Profile = require('../models/profile.model');


//route     profile/me
//desc      createProfile
//acces     private
router.post('/me', auth, async (req, res) => {
    console.log("hello");

    try {
        const profile = await Profile.findOne({
            user: req.user.id
        }).populate("user", ["name", "birthdate", "gender"]);
        console.log(profile);

        if (profile) {
            console.log("profile found");
            res.json(profile);
        }



        console.log("New profile");
        res.json(profile);
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }

})


//route     profile/:id
//desc      OpenFriend'sProfile
//acces     private
router.get('/:id', async (req, res) => {

    try {
        const profile = await Profile.findOne({
            _id: req.params.id
        });


        if (!profile) {
            console.log("profile not found");
        }
        console.log("profile found");
        res.json(profile);
    } catch (error) {
        res.json({ msg: error.message })
    }
})


//route     profile/update/status
//desc      updateStatus
//acces     private
router.put('/update/status', auth, async (req, res) => {

    try {
        const profile = await Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: { status: req.body.status } },
            { new: true }
        );
        return res.json(profile);

    }
    catch (error) {

        return res.json({ msg: error.message });
    }
})
//route     profile/update/posts
//desc      update Status
//acces     private
router.put('/update/posts', auth, async (req, res) => {

    try {
        const profile = await Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: { status: req.body.status } },
            { new: true }
        );
        return res.json(profile);

    }
    catch (error) {

        return res.json({ msg: error.message });
    }
})



module.exports = router;

