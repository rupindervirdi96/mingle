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

//route     profile/update/friends
//desc      send Request
//acces     private
router.put('/update/friends/request/:id', auth, async (req, res) => {


    try {
        let requested = false;
        const profile = await Profile.findOne({
            user: req.user.id
        });
        const friendsProfile = await Profile.findOne({
            _id: req.params.id
        })
        res.json(friendsProfile)
        friendsProfile.contacts.requests.filter((friend) => {
            if (friend.id === profile.id) {
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
                status: "requested"
            }

            friendsProfile.contacts.requests.unshift(friend);
            profile.contacts.requests.unshift(request);
            const res1 = await friendsProfile.save();
            const res2 = await profile.save();
            return res.json({
                friendsProf: res1,
                myProf: res2
            })
        }
        // console.log("hello");
    }
    catch (error) {

        return res.json({ msg: error.message });
    }
})




//route     profile/update/friends
//desc      Accept Request
//acces     private
router.put('/update/friends/accept/:id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id
        });

        const friendsProfile = await Profile.findOne({
            _id: req.params.id
        })
        for (var i = 0; i < profile.contacts.requests.length; i++) {
            if (profile.contacts.requests[i].id == friendsProfile.id) {
                profile.contacts.requests.splice(i, 1);
                const friend = {
                    id: friendsProfile.id,
                    name: friendsProfile.name
                }
                profile.contacts.friends.unshift(friend)
            }
        }
        for (var i = 0; i < friendsProfile.contacts.requests.length; i++) {
            if (friendsProfile.contacts.requests[i].id == profile.id) {
                friendsProfile.contacts.requests.splice(i, 1);
                const friend = {
                    id: profile.id,
                    name: profile.name
                }
                friendsProfile.contacts.friends.unshift(friend)
            }
        }
        console.log("Hello");

        await profile.save()
        await friendsProfile.save()
        // res.json({ prof: profile, frndProf: friendsProfile })

    } catch (error) {
        res.json(error.message);
    }
});


//route     profile/update/friends/allrequests
//desc      View all Requests
//acces     privatef
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
        myProf.contacts.friends.filter((friend) => {
            friendsProfiles.push(friend.id);
        })
        const profiles = await Profile.find({});
        const requests = []
        myProf.contacts.requests.forEach((req) => {
            requests.push(req.id);
        })
        const suggestions = []
        profiles.forEach(profile => {
            if (profile.id != myProf.id && !friendsProfiles.includes(profile.id) && !requests.includes(profile.id)) {
                suggestions.push(profile)
            }
        })
        res.json(suggestions)

    } catch (error) {
        res.json(error.message);
    }
});




module.exports = router;

