const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const PersonModel = mongoose.model('Person');

module.exports = function (app) {
    app.use('/', router);
};

router.get('/', function (req, res, next) {
    // 1. Получить из базы данных всех пользователей
    PersonModel.find({})
        .then(function (persons) {
            //  [{length: %%, weight: %%, waist...}, {...}, {...}]
            // 2.1 Если ошибок при получении не позникло, ответить клиенту 
            //статуса кодом 200 и списком пользователей в формате JSON
            res.status(200).send(persons);
        })
        .catch(function (err) {
            // 2.2 Если возникла ошибка - 500 и сообщение в формате JSON, "Не удалось получить записи"
            res.status(500).send({
                message: "Не удалось получить записи"
            });
        });
});

router.get('/:id', function(req, res, next) {
    let id = req.params.id;
    // 1. Получить из базы данных одного пользователя с идентификаторов id
    // 2.1 Если ошибок при получении не позникло, ответить клиенту 
    //     статуса кодом 200 и пользователя в формате JSON
    // 2.2 Если возникла ошибка - 500 и сообщение в формате JSON, "Не удалось получить запись"
    console.log(id);
    res.status(200).send();
})

router.post('/', function (request, response, nextController) {
    // 1. Получить данные из тела запроса.
    let DB = request.body;
    // 2. Из этих данных сформировать объект тех данных, которые База данных может хранить
    function Transform(DB) {
        let res = {};
        if (DB.length && DB.weigth && DB.voice && DB.waist && DB.foot) {
            res.length = DB.length;
            res.weigth = DB.weigth;
            res.voice = DB.voice;
            res.waist = DB.waist;
            res.foot = DB.foot;
        }
        return res;
    }
    let res = Transform(DB);
    // 3. Сохранить в базу данных этот объект (*)
    res = new PersonModel(res);
    res.save()
        // 4. Ответить клиенту на запрос.
        //  record - сохраненная строчка данных из БД 
        .then(function (record) {
            // 4.1 - Если сохранилось, то статус код 201, и в заголовке идентификатор записи в БД
            response.header('location', record._id.toString());
            response.status(201).send()
        })
        .catch(function (err) {
            // 4.2 - Если нет, то статус код 500, и в ответе сообщение в формате JSON "Сохранение не удалось"
            response.status(500).send({
                message: "Сохранение не удалось"
            });
        })
    // if (!request.body.name || request.body.name.length == 0) {
    //     response.status(400).send("Вы не указали имя");
    //     return;
    // }
    // response.status(201).send(request.body);
});