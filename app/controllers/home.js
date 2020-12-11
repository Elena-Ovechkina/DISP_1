const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const PersonModel = mongoose.model('Person');

module.exports = function (app) {
    app.use('/', router);
};

router.get('/', function (req, res, next) {
    // Article.find(function (err, articles) {
        // if (err) 
            // return next(err);
    // res.header['Content-Type'] = 'text/html; char'
    // res.status(200).send('Привет мир');
    // });
});

router.post('/', function (request, response, nextController) {
    // if (!request.body.name || request.body.name.length == 0) {
    //     response.status(400).send("Вы не указали имя");
    //     return;
    // }
    // response.status(201).send(request.body);
});