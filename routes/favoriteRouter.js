const express = require('express');
const Favorite = require('../models/favorite');
const authenticate = require('../authenticate');
const cors = require('./cors');

const favoriteRouter = express.Router();

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorite.find({
        user: req.user._id
    })
    .populate('user')
    .populate('campsites')
    .then((favorites) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    })
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
    .then((favorite) => {
        if (favorite) {
            req.body.campsites.forEach((campsite) => {
                console.log(favorite.campsites);
                if (!favorite.campsites.includes(campsite)) {
                    favorite.campsites.push(campsite);
                }
            });
            favorite.save(err => {
                if (err) {
                    res.statusCode = 500
                    res.setHeader('Content-Type', 'application/json');
                    res.json({err: err});
                    return;
                } else {
                    console.log(favorite);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                }
            })
        } else {
            Favorite.create({
                user: req.user._id,
                campsites: req.body.campsites
            })
            .then((favorites) => {
                console.log('Favorites added:', req.body.campsites);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);
            })
            .catch(err => next(err));
        }
    })
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOneAndDelete({ user: req.user._id })
    .then((response) => {
        if (response) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(response);
        } else {
            res.setHeader('Content-Type', 'text/plain');
            res.end('You do not have any favorites to delete.');
        }
    })
    .catch(err => next(err));
});

favoriteRouter.route('/:campsiteId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /favorites/campsitesId');
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
    .then((favorite) => {
        if (favorite.campsites.includes(req.params.campsiteId)) {
            res.setHeader('Content-Type', 'text/plain');
            res.end('That campsite is already in the list of favorites!');
        } else {
            favorite.campsites.push(req.params.campsiteId);
            favorite.save(err => {
                if (err) {
                    res.statusCode = 500
                    res.setHeader('Content-Type', 'application/json');
                    res.json({err: err});
                    return;
                } else {
                    console.log(favorite);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                }
            });
        }
    })
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites/campsitesId');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
    .then((favorite) => {
        if (favorite) {
            favorite.campsites.splice(favorite.campsites.indexOf(req.params.campsiteId), 1);
            favorite.save(err => {
                if (err) {
                    res.statusCode = 500
                    res.setHeader('Content-Type', 'application/json');
                    res.json({err: err});
                    return;
                } else {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                }
            });
        } else {
            res.setHeader('Content-Type', 'text/plain');
            res.end('There are no favorites to delete');
        }
    })
});

module.exports = favoriteRouter;