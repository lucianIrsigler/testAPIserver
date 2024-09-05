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


function convertToBase64(string){
    bytes = Buffer.from(string).toString("ascii");
    base64bytes = Buffer.from(bytes).toString("base64");
    base64string = Buffer.from(base64bytes).toString("ascii");
    return base64string;
}

function generateErrorUri(redirect_uri,error){
    return redirect_uri+"?error="+error;
}

function generateAuthTokenUri(redirect_uri,code){
    return redirect_uri+"?code="+code;
}


function checkIfScopesValid(scopes){
    const validScopes = ["maps-get","gps-track",
        "accessibility-get","schedule-get","optimize-route","vehicle-get"];
    
    for (const element of scopes){
        if (!validScopes.includes(element)){
            return false;
        }
    }

    return true;
}

module.exports = {
    generateAuthTokenUri,
    generateErrorUri,
    convertToBase64,
    makeid,
    checkIfScopesValid
} 