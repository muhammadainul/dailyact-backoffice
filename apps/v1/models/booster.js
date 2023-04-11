"use strict";

const { ObjectId } = mongoose.SchemaTypes;

var boosterSchema = new mongoose.Schema(
    {
        userId       : String,
        access_token : String
    },
    {
        timestamps : true
    }
);

var Booster        = mongoose.model("Booster", boosterSchema);
    module.exports = Booster;
