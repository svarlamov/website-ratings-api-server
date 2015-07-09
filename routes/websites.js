var express = require('express');
var router = express.Router();
var Website = require('../models/website');
var Rating = require('../models/rating');
var User = require('../models/user');

// return all websites, and their respective ratings unordered
router.get('/', function(req, res, next) {
	Website.find({}, function(err, sites){
		if (err) {
			console.log("error");
			console.error(err);
			res.send(err);
			return;
		}
		// Populate the website with it's ratings
		sites.forEach(function(obj, index) {
			obj.getRatings(obj, function(err, populated) {
				if (err) {
					console.log("error");
					console.error(err);
					res.send(err);
					return;
				}
				// Set it to the new, populated, object
				sites[index] = populated;
			});
		});
		calculateRatings(sites, function(ratedSites) {
			orderByRating(ratedSites, function(orderedSites) {
				res.json({ sites: orderedSites });
			});
		});
	});
});

function calculateRatings(sites, callback) {
	// TODO: Implement method
	callback(sites);
}

function orderByRating(sites, callback) {
	// TODO: Implement method
	callback(sites);
}

function calculateRating(site) {
	// TODO: Implement method
	return site;
}

// return a single site
router.get('/:domain', function(req, res, next) {
  var domain = req.params.domain;

  if(!domain){
    var errorMsg = "No domain name provided";
    res.status(400);
    res.json({ message: errorMsg });
    return;
  };

  Website.findOne({ domain: domain }, function(err, site) {
		console.log("site : " + site);
		console.log("type is, " + typeof site);
    if (err) {
        console.log("error");
        console.error(err);
        res.send(err);
        return;
    };
		console.log
		if(!site || !site.domain) {
			res.status(404);
			res.json({ "message": "This website has not been added to the DB yet." });
			return;
		}
		site.getRatings(site, function(err, popSite) {
			if(err) {
				console.log("error");
        console.error(err);
        res.send(err);
        return;
			}
			res.json(popSite);
		});
  });
});

// Rate a website- if it doesn't already exist in the DB, then create it, and add the post
router.post('/:domain/rate', function(req, res, next) {
	var domain = req.params.domain;
	var like = req.body.like;
	if(!domain || !like){
		var failObj = { ok: false, message: "A `rate` request must contain a valid domain name in the url, and a boolean `like` value in the body of the request."};
		res.status(400);
		res.json(failObj);
		return;
	}
	Website.find({ domain: domain }, function(err, site) {
		if (err) {
			console.log("error");
			console.error(err);
			res.send(err);
			return;
		}
		if(!site || !site.domain) {
			site = new Website({ domain: domain });
			site.save();
		}
		rateSite(site, req, function(err, rating) {
			console.log("Site " + site + " has been rated");
			if (err) {
				console.log("error");
				console.error(err);
				res.send(err);
				return;
			}
			res.json(rating);
			return;
		});
	});
})

function rateSite(site, req, callback) {
	// TODO: Implement users
	var dummyUser = new User();
	var newRating = new Rating({ like: req.body.like, comment: req.body.comment, website: site.domain, user: dummyUser });
	newRating.save();
	callback(null, newRating);
}

module.exports = router;
