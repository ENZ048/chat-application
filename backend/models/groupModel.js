const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        participents: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user'
            },
        ],
    },
    {
        timestamps: true,
    }
);


const Group = mongoose.model("group", GroupSchema);

module.export = Group;