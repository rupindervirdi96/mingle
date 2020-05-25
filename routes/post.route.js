const express = require('express');
const router = express.Router();
const Post = require('../models/post.model');
const Profile = require('../models/profile.model');
const auth = require('../middleware/auth');


//route   posts/
//desc    createPost
//access  public
router.post('/', auth, async (req, res) => {
    const { text, image } = req.body;

    try {
        const profilee = await Profile.findOne(
            { user: req.user.id }
        );
        console.log(profilee.id);

        const post = new Post({ profile: profilee.id, name: profilee.name, text });
        await post.save();
        res.json(post);
        console.log("post created");
    } catch (error) {
        console.log(error);
    }
})


//route   posts/find/:id
//desc    getPostPersonal
//access  public
router.post('/:id', auth, async (req, res) => {

    const { text } = req.body;
    const post = await Post.findOne(
        { user: req.user.id }
    );
    // const post = new Post({ profile: profile.id, name: profile.name, text });
    await post.save();
    res.json(post);
    console.log("post created");
});


//route   posts/
//desc    getAllPostsForCurrentUser
//access  public
router.get('/', auth, async (req, res) => {

    const profile = await Profile.find({ user: req.user.id });
    const posts = await Post.find(
        { profile: profile }
    );
    res.json(posts);
    console.log("post created");

})





//route   posts/:id/like
//desc    addLikes
//access  public
router.post('/like/:id', auth, async (req, res) => {
    try {
        console.log(req.user.id);
        const profile = await Profile.findOne({ user: req.user.id });
        console.log(profile.id);
        const post = await Post.findById(
            {
                _id: req.params.id
            });
        // if (
        //     post.likes.filter((like) => like.profile.toString() === profile.id).length >
        //     0
        // ) {
        //     return res.status(400).json({ msg: "This post has already been liked.!" });
        // }
        // console.log(profile.id);

        post.likes.filter((like) => {
            if (like.profile.toString() === profile.id) {
                res.status(400).json({ msg: "This post has already been liked.!" });
                return res.json(post);
            }
        })
        post.likes.unshift({ profile: profile.id });
        await post.save();
        res.json(post)
    } catch (error) {
        res.json(error.message);
    }
})




module.exports = router;