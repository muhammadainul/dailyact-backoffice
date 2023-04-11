const { ObjectId } = mongoose.SchemaTypes;

const File = require("./file");

var jobSchema = new mongoose.Schema({
    position : String,
    company  : String
});

var userDetailSchema = new mongoose.Schema(
    {
        userId   : ObjectId,
        username : {
            type    : String,
            default : null
        },
        firstname: {
            type    : String,
            default : null
        },
        lastname: {
            type    : String,
            default : null
        },
        sex: {
            type    : String,
            default : null,
            alias: "gender"
        },
        hobbies: [
            {
                type    : String,
                default : null
            }
        ],
        birthday: {
            type    : Date,
            default : null
        },
        job : jobSchema,
        pp  : {
            type    : ObjectId,
            ref     : "File",
            default : null
        },
        isPrivate: {
            type    : Boolean,
            default : false
        }
    },
    {
        timestamps : true
    }
);

var UserDetail     = mongoose.model("UserDetail", userDetailSchema);
    module.exports = UserDetail;
