var fileSchema = new mongoose.Schema(
	{
			filename: {
					type    : String,
					default : null,
					alias   : "url"
			},
			path: {
					type    : String,
					default : null,
					alias   : "local"
			},
			thumbnail: {
					type    : String,
					default : null
			},
			thumbnail_small: {
					type    : String,
					default : null
			},
			meta : Object
	},
	{
			timestamps : true
	}
);

var File           = mongoose.model("File", fileSchema);
	module.exports = File;
