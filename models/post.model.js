const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const postSchema = new Schema(
    {
        profile: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'profile'
        },
        name: {
            type: String,
            required: true
        },
        image: {
            type: String,
            default: "https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png"
        },
        text: {
            type: String,
            require: true,
            trim: true,
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'profile'
            }
        ],
        comments: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    require: true
                },
                text: {
                    type: String,
                    required: true
                },
                time: {
                    type: Date,
                    default: Date.now
                }
            }
        ],
        date: {
            type: Date,
            default: Date.now()
        }
    }
)

module.exports = Post = mongoose.model('post', postSchema);