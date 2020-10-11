var express = require('express');
var router = express.Router();
var Comment = require('../models/comment');
var Campground = require('../models/campground');

// INDEX ROUTE = show all campgrounds

router.get('/', function(req, res) {
	console.log(req.user);
	// Get all campgrounds from DB
	Campground.find({}, (err, allCampgrounds) => {
		if (err) {
			console.log(err);
		} else {
			res.render('campgrounds/index', { campgrounds: allCampgrounds });
		}
	});
});

// CREATE ROUTE = add new campground to database
router.post('/', isLoggedIn, function(req, res) {
	// get data from form and add to campgrounds array
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = { name: name, image: image, description: desc, author: author };

	// create a new campground and save it to DB
	Campground.create(newCampground, (err, new_camp) => {
		if (err) {
			console.log(err);
		} else {
			// redirect back to campgrounds page
			console.log(new_camp);
			res.redirect('/campgrounds');
		}
	});
});

// NEW = show form to create new campground
router.get('/new', isLoggedIn, function(req, res) {
	res.render('campgrounds/new');
});

router.get('/:id', (req, res) => {
	// find the campground with provided ID
	Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground) {
		if (err) {
			console.log(err);
		} else {
			console.log(foundCampground);
			// render show template with that provided ID
			res.render('campgrounds/show', { campground: foundCampground });
		}
	});
});
//middleware
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
}
module.exports = router;
