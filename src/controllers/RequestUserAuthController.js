const RequestUserAuth = require("../models/RequestUserAuth");


const RequestUserAuthController = {
    async exists(query) {
        try {
            const exists = await RequestUserAuth.exists(query);
            return exists !== null; // Returns true if a document exists, otherwise false
        } catch (error) {
            console.error("Error checking if document exists:", error);
            return false;
        }
    },


    async insertRecord(object){
        try{
            let newCode = new RequestUserAuth({
                client_id:object.client_id,
                scopes:object.splitScopes,
                code:object.code
            });

            const insertNewRecord = await newCode.save();

            if (!insertNewRecord){
                return {success:false,message:"insert_error"};
            }

            return {success:true,message:"insert_success"};
        }catch(error){
            let errorName = err.name;
            if (errorName == "MongoServerError"){
                console.log(err);
                return {success:false,message:"already_has_code"};
            }
        }
    },

    async updateRecord(object){
        const updatedRecord = await RequestUserAuth.findOneAndUpdate(
            {
                client_id:object.client_id
            },
            {
                scopes:object.scopes,
                code:object.code
            },
            {
                new: true,
            }
        )


        if (!updatedRecord) {
            // No record found to update
            return { success: false, message: "Record not found" };
        }

        return { success: true, message: "update_successful"};
    },

    async findOneRecord(query){
        const doc = await RequestUserAuth.find(query);
        if (!doc){
            return {success:false,message:"not_found"};
        }
        return {success:true,data:doc};
    }
};


module.exports = RequestUserAuthController