const mongoose = require("mongoose");

let thirdPartyScheme = new mongoose.Schema({
    client_id: {
        type:String,
        required:true,
        unique:true
    },
    redirect_uri:{
        type:String,
        required:true
    },
    client_secret:{
        type:String,
        required:true,
        unique:true
    }
});

thirdPartyScheme.statics.isClientValid = async function(client_id){
    try{
        const client = await this.exists({ client_id });
        return client!==null;
    }catch(error){
        console.error("Error checking if client is valid:", error);
        return false;
    }
}


module.exports = mongoose.model('ThirdParty', thirdPartyScheme);
