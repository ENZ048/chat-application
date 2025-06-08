const Group = require('../models/groupModel');

const createGroup = async (req, res) => {
    try {
        const {name, participants} = req.body;

        if(!name || !participants || participants.length < 2){
            return res.status(400).send({
                message: "Group requires a name and at least 2 members"
            });
        };

        const group = await new Group({name, participants}).save();
        res.status(200).send({
            message: "Group Created Successfully",
            group
        });
    } catch (error) {
        console.log("Error in creating group : ", error);
        res.status(500).send({
            message: "Internal Server Error"
        });
    }
};

module.exports = {createGroup};