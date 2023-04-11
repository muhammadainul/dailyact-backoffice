"user strict";

const { ObjectId } = mongoose.SchemaTypes;

const User = require("./user");
const Role = require("./role");

const schema = new mongoose.Schema(
    {
        userId: { type: ObjectId, ref: "User", default: null },
        roles: [
            {
                type: ObjectId,
                default: null,
                ref: "Role" // ADMIN, OFFICER
            }
        ]
    },
    {
        timestamps: true
    }
);

var Administration = mongoose.model("Administration", schema);
module.exports = Administration;
