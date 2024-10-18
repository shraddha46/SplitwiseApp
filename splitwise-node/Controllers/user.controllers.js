const User = require('../Models/user');
const TempUser = require('../Models/friend');

const getUserDetails = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ "id": user._id, "username": user.username, "email": user.email , "registration_status": user.registration_status});
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

const getFriends = async (req, res) => {
    try {
        const friends = await TempUser.find({ inviteBy: req.userId });
        return res.status(200).json(friends);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getUserDetails,
    addTempUsers,
    getFriends
}