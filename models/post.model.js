const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const postSchema = new Schema(
    {
        profile: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        profPic: {
            type: String,
            required: true
        },
        image: {
            type: String,
        },
        text: {
            type: String,
            require: true,
            trim: true,
        },
        likes: [
            {
                type: Object
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