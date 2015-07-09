var express = require('express');
var router = express.Router();
var Website = require('../models/website');
var Rating = require('../models/rating');

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
    res.status(401);
    res.json({ message: errorMsg });
    return;
  };

  Website.findOne({ domain: domain }, function(err, site) {
    if (err) {
        console.log("error");
        console.error(err);
        res.send(err);
        return;
    };
		site.getRatings(site, function(err, site) {
			if(err) {
				console.log("error");
        console.error(err);
        res.send(err);
        return;
			}
			res.json(site);
		});
  });
});

// rate a site in the db, and create the site if it does not yet exist
router.post('/:domain/rate', function(req, res, next) {
  var domain = req.params.domain;
  if(!domain){
    var errorMsg = "No domain name provided";
    res.status(401);
    res.json({ message: errorMsg });
    return;
  };
	// Try to find the domain first
  Website.findById(domain, function(err, site) {
    if (err) {
        console.log("error");
        console.error(err);
        res.send(err);
        return;
    };
		// If the site does not exist, create one, and then add the add the rating to it
    res.json(site);

  });
});


// Rate a website- if it doesn't already exist in the DB, then create it, and add the post
router.post('/:domain/rate', function(req, res, next) {
	var domain = req.params.domain;
	var like = req.body.like;
	if(!domain || !like){
		var failObj = { ok: false, message: "A `rate` request must contain a valid domain name in the url, and a boolean `like` value in the body of the request."};
		res.status(401);
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
		if(!site) {
			var newSite = new Website({ domain: domain });
			newSite.save();
			rateSite(newSite, req, function(err, rating) {
				if (err) {
					console.log("error");
					console.error(err);
					res.send(err);
					return;
				}
				res.json(rating);
				return;
			});
		}
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
