const mongoose = require("mongoose");

const schema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    },

    roles: {
        roblox: {
            type: String,
            required: true,
        },
        
        discord: {
            type: String,
            required: true,
        },
    },

    created: {
        type: Date,
        default: Date.now,
    },

});

module.exports = mongoose.model("Staff", schema);
