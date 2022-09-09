const mongoose = require("mongoose");

const Staff = new mongoose.Schema({

    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Staff",
        required: true,
    },

    created: {
        type: Date,
        default: Date.now,
    },

});

const schema = new mongoose.Schema({

    roblox: {
        type: String,
        required: true,
    },

    discord: {
        type: String,
        required: true,
    },

    balance: {
        type: String,
        default: "0",
    },

    staff: [Staff],

    created: {
        type: Date,
        default: Date.now,
    },

});

module.exports = mongoose.model("Client", schema);
