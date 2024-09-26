const User = require('../Models/user');
const jwthelper = require('../Helper/jwtHelper');

const registration = async (req, res) => {
    try {
        var user = await User.create(req.body);
        return res.status(200).json(user);
    } catch (error) {
        if (error.code == 11000)
            return res.status(500).send('Duplicate email not allowed');
        return res.status(500).send('an error occured while create user');
    }
}

const login = async (req, res) => {
    const body = req.body;
    try {
        var user = await User.findOne({ email: body.email });
        if (user) {
            if (user.password === body.password) {
                var userFind = await User.findOne({ password: body.password });
                var token = await jwthelper.sign(userFind._id, "some secret");
                return res.status(200).json({ "id": userFind._id, "username": userFind.username, email: userFind.email, "token": token });
            } else {
                return res.status(401).send('Password is invalid!!');
            }
        } else {
            return res.status(401).send('Email Id is invalid!!');
        }
    } catch (error) {
        return res.status(500).send('Internal server error');
    }
}

module.exports = {
    registration,
    login
}