"user strict";

const { ObjectId } = mongoose.SchemaTypes;

const schema = new mongoose.Schema(
    {
        role: {
            type: String,
            default: null,
            alias: "name"
        },
        description: {
            type: String,
            default: null
        },
        privileges: [
            {
                type: ObjectId,
                default: null,
                ref: "Privilege"
            }
        ]
    },
    {
        timestamps: true
    }
);

const Role = mongoose.model("Role", schema);
module.exports = Role;
