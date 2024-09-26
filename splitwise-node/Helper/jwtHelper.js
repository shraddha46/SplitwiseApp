var jwt = require('jsonwebtoken');
module.exports = {
    sign: function (id, secret) {
        return jwt.sign({ _id: id }, secret, { expiresIn: '24h' });
    },
    verify: function (token, secret) {
        //try{
        return jwt.verify(token, secret);
        // }catch(error){
        //     console.log("Error while verifying token:",error);
        //     return {error};
        // }
    }
};