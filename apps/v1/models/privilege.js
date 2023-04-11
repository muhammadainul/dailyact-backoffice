"user strict";

const { ObjectId } = mongoose.SchemaTypes;

const Service = require("./service");

const schema = new mongoose.Schema(
    {
        privilege: {
            type: String,
            default: null,
            alias: "name"
        },
        description: {
            type: String,
            default: null
        },
        service: {
            type: ObjectId,
            default: null,
            ref: "Service"
        },
        actions: [
            {
                type: String,
                default: null
            }
        ]
    },
    {
        timestamps: true
    }
);

const Privilege = mongoose.model("Privilege", schema);
module.exports = Privilege;
