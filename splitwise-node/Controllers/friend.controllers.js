var mongoose = require("mongoose");
const Friend = require('../Models/friend');

const addFriends = async (req, res) => {
    try {
        var addFriendsData = await Friend.insertMany(req.body);
        return res.status(200).json(addFriendsData);
    } catch (error) {
        return res.status(500).send('an error occured while create friends');
    }
}

const getFriends = async (req, res) => {
    try {
        console.log("ree", req.userId)
        const friends = await Friend.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(req.userId) } },
            {
                $lookup: {
                    from: 'User',
                    localField: 'friendId',
                    foreignField: '_id',
                    as: 'friendDetail',
                },
            },
            {
                $unwind: {
                    path: '$friendDetail',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    _id: '$_id',
                    status: '$status',
                    userId: '$userId',
                    friendId: '$friendId',
                    username: '$friendDetail.username',
                    email: '$friendDetail.email'
                }
            }
        ]);
        return res.status(200).json(friends);
    } catch (error) {
        console.log("eeee", error)
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    addFriends,
    getFriends
}