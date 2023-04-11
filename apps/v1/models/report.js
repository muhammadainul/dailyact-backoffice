"user strict";

const { ObjectId } = mongoose.SchemaTypes;

const schema = new mongoose.Schema(
    {
        userId : ObjectId,
        type   : {
            type : String,
            enum : ["POST", "STORY", "COMMENT", "USER", "COMMUNITY"]
        },
        object : Object,
		reason : String,
		vision : [Object]
    },
    {
        timestamps : true
    }
);

const Report         = mongoose.model("Report", schema);
      module.exports = Report;
