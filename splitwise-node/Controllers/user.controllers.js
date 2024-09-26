const User = require('../Models/user');
const TempUser = require('../Models/tempUser');

const getUserDetails = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ "id": user._id, "username": user.username, "email": user.email });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const addTempUsers = async (req, res) => {
    try {
        var tempUser = await TempUser.insertMany(req.body);
        return res.status(200).json(tempUser);
    } catch (error) {
        return res.status(500).send('an error occured while create temporary users');
    }
}

module.exports = {
    getUserDetails,
    addTempUsers
}