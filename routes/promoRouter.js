const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Promos = require('../models/promotions');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/')

.get((req,res,next) => {
    Promos.find({})
    .then((promos) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promos);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.post((req, res, next) => {
    Promos.create(req.body)
    .then((Promo) => {
        console.log('Dish Created ', Promo);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(Promo);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
})
.delete((req, res, next) => {
    Promos.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));   
});

promoRouter.route('/:promotionId')

.get((req,res,next) => {
    Promos.findById(req.params.promotionId)
    .then((Promo) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(Promo);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /promotions/'+ req.params.promotionId);
})
.put((req, res, next) => {
    Promos.findByIdAndUpdate(req.params.promotionId, {
        $set: req.body
    }, { new: true })
    .then((Promo) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(Promo);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) => {
    Promos.findByIdAndRemove(req.params.promotionId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = promoRouter;