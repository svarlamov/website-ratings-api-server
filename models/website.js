var mongoose = require('mongoose');
var Rating = require('./rating');
var Schema = mongoose.Schema;

websiteSchema = new Schema({
	// The '_id' field is the domain name of the site
	domain: { type: String, required: true, unique: true },
	createdAt: Date,
	updatedAt: Date
});

// on every save, add the date
websiteSchema.pre('save', function(next) {
	// TODO: Verify the domain
	// get the current date
	var currentDate = new Date();

	// change the updatedAt field to current date
	this.updatedAt = currentDate;

	// if createdAt doesn't exist, add to that field
	if (!this.createdAt)
	this.createdAt = currentDate;

	next();
});

websiteSchema.methods.getRatings = function getRatings(site, callback) {
	Rating.find({ website: site.domain }, function(err, ratingsArr) {
		if(err) {
			callback(err, null);
			return;
		}
		site.ratings = [];
		ratingsArr.forEach(function(obj, index) {
			site.ratings.push(obj);
		});
		callback(null, site);
	});
}

var Website = mongoose.model('Website', websiteSchema);

module.exports = Website;
