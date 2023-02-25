const express = require('express');
const Partner = require('../models/partner');
const partnerRouter = express.Router();

partnerRouter.route('/')
.get((req, res, next) => {
    Partner.find()
    .then((partners) => {
        res.statusCode = 200;
        res.contentType('Content-Type', 'application/json');
        res.json(partners);
    })
    .catch(err => next(err));
})
.post((req, res, next) => {
    Partner.create(req.body)
    .then((partner) => {
        console.log(`Partner ${req.body.name} added.`);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partner);
    })
    .catch(err => {next(err)});
})
.put((req, res) =>{
    res.statusCode = 403;
    res.end('PUT operation not supported on /partners');
})
.delete((req, res) => {
    Partner.deleteMany()
    .then(response => {
        console.log('Deleted all Partners');
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

partnerRouter.route('/:partnerId')
.get((req, res, next) => {
    Partner.findById(req.params.partnerId)
    .then((partner) => {
        console.log(`Found partner ${req.params.partnerId}`);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partner);
    })
    .catch(err => next(err));
})
.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /partners/${req.params.partnerId}`);
})
.put((req, res) =>{
    Partner.findByIdAndUpdate(req.params.partnerId,{
        $set: req.body
    }, { new: true })
    .then((partner) => {
        console.log(`Partner ${req.params.partnerId} was updated.`);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partner);
    })
    .catch(err => next(err));
})
.delete((req, res) => {
    Partner.findByIdAndDelete(req.params.partnerId)
    .this(response => {
        console.log(`Partner ${req.params.partnerId} was deleted`)
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

module.exports = partnerRouter;