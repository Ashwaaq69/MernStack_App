const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    numViews: {
        type: Number,
        default: 0,
    },
    isLiked: {
        type: Boolean,
        default: false,
    },
    isDisliked: {
        type: Boolean,
        default: false,
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    dislikes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
   
    images: {
        type: String,
        default: "https://imgs.search.brave.com/v7R6966q2cIUqcIBZTnMl1HDf3h8Yfy5wBnNmy0fq-k/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by9ub3RlYm9vay13/aXRoLWJsb2ctd29y/ZC1jb21wdXRlci1k/ZXNrXzEwNDE2NS0x/OS5qcGc_c2VtdD1h/aXNfaHlicmlk"
    },
    author: {
        type: String,
        default: "Admin",
    },
}, {
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    },
    timestamps: true,
});

// Export the model
module.exports = mongoose.model('Blog', BlogSchema);