const ThirdParty = require("../models/ThirdParty");

const ThirdPartyController = {
    async exists(query) {
        try {
            const exists = await ThirdParty.exists(query);
            return exists !== null; // Returns true if a document exists, otherwise false
        } catch (error) {
            console.error("Error checking if document exists:", error);
            return false;
        }
    },


    async findOneRecord(query){
        const doc = await ThirdParty.find(query);
        if (!doc){
            return {success:false,message:"not_found"};
        }
        return {success:true,data:doc};
    }
    
    // You can add other methods for ThirdPartyController here as needed
};


module.exports = ThirdPartyController
