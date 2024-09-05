const mongoose = require("mongoose");
const ThirdParty = require("./ThirdParty");

let requestUserAuth = new mongoose.Schema({
    client_id:{
        type:String,
        ref:"ThirdParty"
    },
    scopes:{
        type:[String]
    },
    code:{
        type:String,
        required:true
    }
})


requestUserAuth.pre('save', async function(next) {
    // `this` refers to the current document being saved
    const isValidClient = await ThirdParty.isClientValid(this.client_id);
    if (!isValidClient) {
        const err = new Error('Invalid client_id provided.');
        return next(err);
    }
    next();
});


requestUserAuth.statics.isClientValid = async function(client_id){
    try{
        const client = await this.exists({ client_id });
        return client!==null;
    }catch(error){
        console.error("Error checking if client_id is valid:", error);
        return false;
    }
}


module.exports = mongoose.model('requestuserauth', requestUserAuth);
