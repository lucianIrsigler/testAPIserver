const express = require("express");
const router = express.Router();
const misc = require("../../../util/misc")
const token = require("../../../util/tokenMethods")
const ThirdPartyController = require("../../../controllers/ThirdPartyController");
const RequestUserAuthController = require("../../../controllers/RequestUserAuthController");


/*
    Request User Authorization of https://developer.spotify.com/documentation/web-api/tutorials/code-flow
*/
router.get("/authorize", async (req, res) => {
    const redirect_uri = req.query["redirect_uri"];
    const response_type = req.query["response_type"];
    const client_id = req.query["client_id"];
    const scopes = req.query["scopes"];
    let splitScopes;
    let code;

    //These fields are required
    if (redirect_uri === undefined) {
        return res.json({ "error": "redirect_uri must be specified" });
    }else if (response_type === undefined) {
        return res.redirect(misc.generateErrorUri(redirect_uri, "response_type_invalid"));
    } else if (client_id === undefined) {
        return res.redirect(misc.generateErrorUri(redirect_uri, "client_id_not_provided"));
    }


    //split up scopes
    if (scopes !== undefined) {
        splitScopes = scopes.split(" ");
        if (!misc.checkIfScopesValid(splitScopes)){
            return res.redirect(misc.generateErrorUri(redirect_uri, "scopes_invalid"));
        }
    }

    //checks if clientID exists

    let clientExists = await ThirdPartyController.exists({client_id:client_id});

    if (!clientExists){
        return res.redirect(misc.generateErrorUri(redirect_uri,"invalid_client_id"));
    }

    code = token.generateCode();

    /** 
     * If the code exists, then update,else insert
     * TODO add "when acquired" time to code and dont let clients overload server
     * 
    */

    let found = await RequestUserAuthController.exists({client_id:client_id});

    console.log(found);

    if (found){
        let obj = {
            "client_id":client_id,
            "scopes":splitScopes,
            "code":code
            };

        let status = await RequestUserAuthController.updateRecord(obj)
        console.log(status);

        if (status.message=="update_successful"){
            res.redirect(misc.generateAuthTokenUri(redirect_uri,code));
        }else{
            res.redirect(misc.generateErrorUri(status.message))
        }
    }else{
        let newCode = {
            client_id:client_id,
            scopes:splitScopes,
            code:code
        };

        let status = await RequestUserAuthController.insertRecord(newCode);

        if (status.message=="insert_success"){
            res.redirect(misc.generateAuthTokenUri(code))
        }else{
            res.redirect(misc.generateErrorUri(status.message.name))
        }
    }
});

module.exports = router;