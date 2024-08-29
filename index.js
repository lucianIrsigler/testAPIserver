const express = require('express');
const app = express();
app.use(express.json());



function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

function generateErrorUri(redirect_uri,error){
    return redirect_uri+"?error="+error;
}

function generateAuthTokenUri(redirect_uri){
    return redirect_uri+"?code="+makeid(10);
}

const validScopes = ["maps-get","gps-track",
    "accessibility-get","schedule-get","optimize-route","vehicle-get"];


/*
    Request User Authorization of https://developer.spotify.com/documentation/web-api/tutorials/code-flow
*/
app.get("/authorize", (req, res) => {
    const redirect_uri = req.query["redirect_uri"];
    const response_type = req.query["response_type"];
    const client_id = req.query["client_id"];
    const scopes = req.query["scopes"];

    if (redirect_uri === undefined) {
        res.json({ "error": "redirect_uri must be specified" });
        return;
    }

    if (response_type === undefined) {
        res.redirect(generateErrorUri(redirect_uri, "response_type_invalid"));
        return;
    } else if (client_id === undefined) {
        res.redirect(generateErrorUri(redirect_uri, "client_id_invalid"));
        return;
    }

    if (scopes !== undefined) {
        let splitScopes = scopes.split(" ");
        for (const element of splitScopes){
            if (!validScopes.includes(element)){
                console.log(element)
                res.redirect(generateErrorUri(redirect_uri, "scopes_invalid"));
                return; 
            }
        }
    }

    res.redirect(generateAuthTokenUri(redirect_uri));
});
    
/*
    Request an access token of https://developer.spotify.com/documentation/web-api/tutorials/code-flow
*/
app.post("/api/token",(req,res)=>{
    const grant_type = req.body["grant_type"];
    const code = req.body["code"];
    const redirect_uri = req.body["redirect_uri"];
    const content_type = req.get("Content-Type");
    const authorization = req.get("Authorization");

    if (content_type == undefined || content_type!="application/json"){
        res.send({"error":"Content-Type header invalid"});
        return;
    }

    if (grant_type == undefined){
        res.send({"error":"Grant type must be provided"})
        return;
    }
    
    if (code == undefined){
        res.send({"error":"Code must be provided"});
        return;
    }
    
    if (redirect_uri == undefined){
        res.send({"error":"redirect_uri must be provided"});
        return;
    }
    
    if (authorization == undefined){
        res.send({"error":"Authorization header invalid"});
        return;
    }

    //do checks


    res.send({
        "access_token":"TOKEN",
        "token_type":"Bearer",
        "scope":"SCOPES",
        "expires_in":"TIME",
        "refresh_token":""
    })
    
});


const port = process.env.PORT || 3000;


// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}/`);
});