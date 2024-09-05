const mongoose = require("mongoose");
const RequestUserAuth = require("./RequestUserAuth");

let accessToken = new mongoose.Schema({
    client_id:{
        type:String,
        ref:"requestuserauth",
        unique:true
    },
    access_token:{
        type:String,
        required:true,
        unique:true
    },
    scopes:{
        type:[String]
    },
    expires_in:{
        type:Number,
        required:true
    },
    refresh_token:{
        type:String,
        required:true,
        unique:true
    }
})

accessToken.pre('save', async function(next) {
    // `this` refers to the current document being saved
    const isValidCode = await RequestUserAuth.isClientValid(this.client_id);
    if (!isValidCode) {
        const err = new Error('Invalid code provided.');
        return next(err);
    }
    next();
});


module.exports = mongoose.model('accesstokens', accessToken);
