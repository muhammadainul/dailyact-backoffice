"user strict";

const schema = new mongoose.Schema(
    {
        service: {
            type: String,
            default: null
        },
        url: {
            type: String,
            default: null
        }
    },
    {
        timestamps: true
    }
);

const Service = mongoose.model("Service", schema);
module.exports = Service;
