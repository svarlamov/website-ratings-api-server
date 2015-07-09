var mongoose = require('mongoose');
var Schema = mongoose.Schema;

userSchema = new Schema({
	name: String,
	email: String,
	createdAt: Date,
	updatedAt: Date
});

// on every save, add the date
userSchema.pre('save', function(next) {
	// get the current date
	var currentDate = new Date();

	// change the updatedAt field to current date
	this.updatedAt = currentDate;

	// if createdAt doesn't exist, add to that field
	if (!this.createdAt)
	this.createdAt = currentDate;

	next();
});

var User = mongoose.model('User', userSchema);

module.exports = User;