const misc = require("./misc");

function generateCode(){
    return misc.makeid(10);
}


function generateAccessToken(){
    return misc.makeid(16);
}

function generateRefreshToken(){
    return misc.makeid(12);
}


module.exports = {
    generateCode,
    generateAccessToken,
    generateRefreshToken
}