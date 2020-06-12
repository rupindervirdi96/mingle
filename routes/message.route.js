const express = require('express');
const router = express.Router();
const Message = require('../models/message.model');
const ChatRoom = require('../models/chatRoom.model');
const Profile = require('../models/profile.model');
const auth = require('../middleware/auth');

//route   messages
//desc    sendMessage
//access  public
router.post('/', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        const friendsProfile = await Profile.findOne({ _id: req.body.id })
        var message = new Message({ sender: profile._id, text: req.body.text });
        var roomId;
        profile.chats.forEach((chat) => {
            if (chat.friendsProfile == friendsProfile._id.toString()) {
                roomId = chat.roomId;
            }
        })

        var room = await ChatRoom.findOne({
            _id: roomId
        });
        if (room) {
            room.messages.push(message);
            room.save();
        }
        return res.json({ id: friendsProfile._id.toString(), messages: room.messages });
    }
    catch (error) {
        res.json(error.message)
    }
})
/*
Friends profile id is required and text message is required.
If
*/




//route   messages/
//desc    getMessages
//access  public
router.get("/:id", auth, async (req, res) => {
    try {

        const profile = await Profile.findOne({ user: req.user.id });
        const friendsProfile = await Profile.findOne({ _id: req.params.id })
        var exist = false;
        var roomId;
        var messages = [];
        profile.chats.forEach(chat => {
            if (chat.friendsProfile == friendsProfile._id.toString()) {
                exist = true;
                roomId = chat.roomId;
            }
        })

        if (exist) {
            var room = await ChatRoom.findOne({ _id: roomId });
            room.messages.forEach(message => {
                messages.push(message);
            })
            return res.json({ messages: messages, friend: { id: friendsProfile._id.toString(), profPic: friendsProfile.profilePic, name: friendsProfile.name } });

        }
        else {
            var newChatRoom = new ChatRoom();
            var chat_room = await newChatRoom.save();
            const chat1 = {
                roomId: chat_room._id.toString(),
                friendsProfile: friendsProfile._id.toString()
            }
            const chat2 = {
                roomId: chat_room._id.toString(),
                friendsProfile: profile._id.toString(),
            }
            profile.chats.push(chat1);
            friendsProfile.chats.push(chat2);
            profile.save();
            friendsProfile.save();
            return res.json({ messages: messages, friend: { id: friendsProfile._id.toString(), profPic: friendsProfile.profilePic, name: friendsProfile.name } });


        }
    } catch (error) {
        res.json(error.message);
    }


})




module.exports = router;