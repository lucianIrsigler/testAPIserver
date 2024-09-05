const express = require("express");
const router = express.Router();
const misc = require("../../../util/misc")
const tokenHelpers = require("../../../util/tokenMethods")
const ThirdPartyController = require("../../../controllers/ThirdPartyController");
const RequestUserAuthController = require("../../../controllers/RequestUserAuthController");
const AccessTokenController = require("../../../controllers/AccessTokenController");

/*
    Request an access token of https://developer.spotify.com/documentation/web-api/tutorials/code-flow
*/
router.post("/token",async (req,res)=>{
    const grant_type = req.body["grant_type"];
    const code = req.body["code"];
    const redirect_uri = req.body["redirect_uri"];
    const content_type = req.get("Content-Type");
    const authorization = req.get("Authorization");

    if (content_type == undefined || content_type!="application/json"){
        return res.send({"error":"Content-Type header invalid"});
    }else if (grant_type == undefined){
        return res.send({"error":"Grant type must be provided"})
    }else if (code == undefined){
        return res.send({"error":"Code must be provided"});
    }else if (redirect_uri == undefined){
        return res.send({"error":"redirect_uri must be provided"});
    }else if (authorization == undefined){
        return res.send({"error":"Authorization header invalid"});
    }

    let codeExists = await RequestUserAuthController.exists({code:code})

    //If code doesnt exist, then invalid request
    if (!codeExists){
        return res.send({"error":"Invalid code"});
    }

    // //check redirect_uri for security reasons
    let codeDoc = await RequestUserAuthController.findOneRecord({code:code})

    if (codeDoc.success==false){
        //TODO something here
    }
    let client_id = codeDoc.data[0]["client_id"];

    let clientInfo = await ThirdPartyController.findOneRecord({client_id:client_id});

    if (clientInfo.status==false){
        //TODO something here
    }

    let clientRedirectUri = clientInfo.data[0]["redirect_uri"];

    if (redirect_uri!=clientRedirectUri){
        return res.send({"error":"Invalid redirect_uri"});
    }
    
    // //base64 check
    let serverBase64String = misc.convertToBase64(client_id+":"+clientInfo.data[0]["client_secret"]);
    let providedBase64String= authorization.split(" ")[1];

    if (serverBase64String!=providedBase64String){
        return res.send({"error":"Authorization failed"});
    }


    //generate tokens
    let access_token = tokenHelpers.generateAccessToken();
    let refresh_token = tokenHelpers.generateRefreshToken();

    // Get access token

    let obj = {
        client_id:client_id,
        access_token:access_token,
        scopes:codeDoc.data[0]["scopes"],
        expires_in:10,
        refresh_token:refresh_token
    }

    let status = await AccessTokenController.generate(obj);

    if (status.success==true){
        let newToken = {
            "access_token":status.data.access_token,
            "token_type":"Bearer",
            "scope":status.data.scopes,
            "expires_in":status.data.expires_in,
            "refresh_token":status.data.refresh_token
        }

        res.send(newToken);
    } 
});


module.exports = router;
