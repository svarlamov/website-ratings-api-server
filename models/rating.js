var mongoose = require('mongoose');
var User = require('./user');
var Website = require('./website');
var Schema = mongoose.Schema;

ratingSchema = new Schema({
	user: { type: mongoose.Schema.ObjectId, required: true, ref: 'User' },
	// Domain name of the website that the rating is sticky to
	website: { type: String, required: true },
	like: { type: Boolean, default: true },
	comment: String,
	createdAt: Date,
	updatedAt: Date
});

// on every save, add the date
ratingSchema.pre('save', function(next) {
	// get the current date
	var currentDate = new Date();

	// change the updatedAt field to current date
	this.updatedAt = currentDate;

	// if createdAt doesn't exist, add to that field
	if (!this.createdAt)
	this.createdAt = currentDate;

	next();
});

var Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;
