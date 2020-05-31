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


//route     profile/update/friends
//desc      send Request
//acces     private
router.put('/update/friends/request', auth, async (req, res) => {


    try {
        let requested = false;
        const profile = await Profile.findOne({
            user: req.user.id
        });
        const friendsProfile = await Profile.findOne({
            _id: req.body.id
        })

        friendsProfile.friends.filter((friend) => {
            if (friend.id === profile.id && friend.status === "received") {
                res.json("Friend Request already sent.")
                requested = true;
            }
        });
        if (!requested) {
            const friend = {
                id: profile.id,
                name: profile.name,
                status: "received"
            }
            const request = {
                id: friendsProfile.id,
                name: friendsProfile.name,
                status: "sent"
            }

            friendsProfile.friends.unshift(friend);
            profile.friends.unshift(request);
            const res1 = await friendsProfile.save();
            const res2 = await profile.save();
            return res.json({
                friendsProf: res1,
                myProf: res2
            })
        }
        console.log("hello");
    }
    catch (error) {

        return res.json({ msg: error.message });
    }
})




//route     profile/update/friends
//desc      Accept Request
//acces     private
router.put('/update/friends/accept', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id
        });
        // const friendsProfile = await Profile.findOne({
        //     _id: req.body.id
        // })
        profile.friends.filter((friend) => {
            if (friend.id === req.body.id) {
                friend.status = "friends";
            }
        })

        res.json(profile);
    } catch (error) {
        res.json(error.message);
    }
});


//route     profile/update/friends/allrequests
//desc      View all Requests
//acces     private
router.get('/update/friends/allrequests', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id
        });
        res.json(profile.friends)
    } catch (error) {
        res.json(error.message);
    }
});


//route     profile/update/getSuggestions
//desc      getSuggestions
//acces     private
router.get('/update/suggestions', auth, async (req, res) => {
    try {
        const myProf = await Profile.findOne({
            user: req.user.id
        })
        const friendsProfiles = [];
        myProf.friends.filter((friend) => {
            friendsProfiles.push(friend.id);
        })
        const profiles = await Profile.find({});
        const suggestions = []
        profiles.forEach(profile => {
            if (profile.id != myProf.id && !friendsProfiles.includes(profile.id)) {
                suggestions.push(profile)
            }
        })
        res.json(suggestions)

    } catch (error) {
        res.json(error.message);
    }
});

//route     profile/update/getSuggestions
//desc      getSuggestions
//acces     private
router.get('/update/suggestions', auth, async (req, res) => {
    try {
        const myProf = await Profile.findOne({
            user: req.user.id
        })
        const friendsProfiles = [];
        myProf.friends.filter((friend) => {
            friendsProfiles.push(friend.id);
        })
        const profiles = await Profile.find({});
        const suggestions = []
        profiles.forEach(profile => {
            if (profile.id != myProf.id && !friendsProfiles.includes(profile.id)) {
                suggestions.push(profile)
            }
        })
        res.json(suggestions)

    } catch (error) {
        res.json(error.message);
    }
});


module.exports = router;

