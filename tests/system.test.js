const config = require('./../config/config');
const serverAddress = config.serverAddress;

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const expect = chai.expect;
if (config.app.env == 'development')
    require('./../app');

const mongoose = require('mongoose');
const PersonModel = mongoose.model('Person');

//  Раздел тестов
describe('Интеграционные тесты', function () {

    it('Тест создания пользователя: валидные данные', function (done) {
        let agent = chai.request(serverAddress);
        agent = agent.post('/person');
        agent.send({
            length: 200,
            weigth: Math.random(),
            voice: 'Высокий',
            waist: 10,
            foot: 100
        })
            .then(function (response) {
                expect(response).has.status(201);
                expect(response.headers.location).is.exist;
                let id = response.headers.location;
                return PersonModel.findOne({ _id: id });
            })
            .then(function (user) {
                if (!user) {
                    done(new Error("Ошибка, такого пользователя в БД нет"));
                    return;
                }

                done();
            })
            .catch(function (err) {
                done(err);
            });
    });

    it('Проверка delete', function (done) {
        let agent = chai.request(serverAddress);
        agent = agent.post('/person');
        agent.send({
            length: 200,
            weigth: Math.random(),
            voice: 'Высокий',
            waist: 10,
            foot: 100
        })
            .then(function (response) {
                let agent = chai.request(serverAddress);
                agent = agent.delete('/person/' + response.headers['location']);
                return agent.send();
            })
            .then(function (answer) {
                expect(answer).has.status(202);
                done();
            })
            .catch(function (err) {
                done(err);
            })
    });

    it("Проверка Get получения всех пользователей БД", function (done) {
        let DB;
        PersonModel.find({})
            .then(function (persons) {
                DB = persons;
                let request = chai.request(serverAddress);
                request = request.get('/person');
                return request.send();
            })
            .then(function (answer) {
                expect(answer).has.status(200);
                //  Алгоритм
                /**
                 * 1) Сравниваем длины массивов.
                 * 1.1) Если длины массивов разные, то они никогда не равны
                 * 1.2) Если длины одинаковые, то перейти к шагу 2
                 * 2) Перебрать все элементы DB
                 * 2.1) Для текущего элемента найти ему пару из ответа от сервера (найти по _id)
                 * 2.1.1) Если элемента такого в ответе нет, то массивы разные
                 * 2.1.2) Если элемент найден то шаг 2.2
                 * 2.2) Сравнить два объекта по их свойствам (ключи и их значения должны совпадать)
                 * 2.2.1) Если совпали, то текущий элемент равен элементу из ответа
                 * 2.2.2) Если нет, то они разные, а следовательно и массивы разные
                 */
                //1. (либо так)
                expect(answer.body.length).to.be.eql(DB.length);
                // 1. (либо так)
                expect(answer.body).has.length(DB.length);
                for (let item of DB) {
                    //  item - один из объектов БД

                    let suspect = answer.body.find(function (item1) {
                        //  item - один из объектов Ответа
                        return item._id.toString() == item1._id;
                    });
                    expect(suspect).is.not.undefined
                    expect(suspect.foot).to.be.eql(item.foot)
                    expect(suspect.length).to.be.eql(item.length)
                    expect(suspect.voice).to.be.eql(item.voice)
                    expect(suspect.waist).to.be.eql(item.waist)
                    expect(suspect.weigth).to.be.eql(item.weigth)
                }
                done();
            })
            .catch(function (err) {
                done(err)
            })
    })

    it("Проверка Get для получения конкретного пользователя", function (done) {
        let DB;
        PersonModel.findOne({})
            .then(function (specific) {
                DB = specific
                let request = chai.request(serverAddress);
                request = request.get('/person/' + specific._id);
                return request.send();
            })
            .then(function (answer) {
                expect(answer).has.status(200)
                expect(answer.body).is.not.empty
                expect(answer.body.foot).to.be.eql(DB.foot)
                expect(answer.body.length).to.be.eql(DB.length)
                expect(answer.body.voice).to.be.eql(DB.voice)
                expect(answer.body.waist).to.be.eql(DB.waist)
                expect(answer.body.weigth).to.be.eql(DB.weigth)
                done()
            })
            .catch(function (err) {
                done(err)
            })
    })
    it("Проверка Patch на обновление данных", function (done) {
        let res = {
            length: 180,
            weigth: 90,
            voice: "звонкий",
            waist: 15,
            foot: 40,
        }
        PersonModel.findOne({})
            .then(function (original) {
                let request = chai.request(serverAddress);
                request = request.patch('/person/' + original._id)
                return request.send (res)
            })
            .then(function(answer) {
                expect(answer).has.status(200)
                expect(answer.body).is.not.empty
                expect(answer.body.foot).to.be.eql(res.foot)
                expect(answer.body.length).to.be.eql(res.length)
                expect(answer.body.voice).to.be.eql(res.voice)
                expect(answer.body.waist).to.be.eql(res.waist)
                expect(answer.body.weigth).to.be.eql(res.weigth)
                done()
            })
            .catch(function(err){
                done(err)
            })
    })
})