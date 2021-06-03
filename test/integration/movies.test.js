const request = require('supertest');
const mongoose = require("mongoose");
const {Genre} = require("../../models/Genre");
const {Movie} = require("../../models/Movie");
const _ = require('lodash')
const {User} = require("../../models/User");
let server;

describe('/api/movies', function () {
    beforeEach(() => {
        server = require('../../index');
    })
    afterEach(async () => {
        await Movie.deleteMany({});
        await Genre.deleteMany({});
        await server.close();
    });
    describe('get /', function () {
        it('should return all movies', async function () {
            let genre = await (new Genre({name: 'horror'})).save()
            let movie = await (new Movie({
                title: 'SomeName',
                genre: _.pick(genre,['name','_id']),
                numberInStock: 3,
                dailyRentalRate: 2
            })).save()
            const res = await request(server).get('/api/movies')
            expect(res.body.length).toBe(1)
        });
    });
    describe('post /', function () {
        let path = '/api/movies'
        it('should return 401 when no token is supplied', async function () {
            const res = await request(server).post(path)
            expect(res.status).toBe(401)
        });

        it('should return 400 when no title is supplied', async function () {
            let token = (new User()).generateAuthToken()
            let payload = {
                genreId: 'zxcxzcz',
                numberInStock: 3,
                dailyRentalRate: 2
            }
            const res = await request(server)
                .post(path)
                .set('x-auth-token', token)
                .send({});;
                expect(res.status).toBe(400)
        });

        it('should return 400 when no genreId is supplied', async function () {
            let token = (new User()).generateAuthToken()
            let payload = {
                title: 'SomeName',
                numberInStock: 3,
                dailyRentalRate: 2
            }
            const res = await request(server)
                .post(path)
                .set('x-auth-token', token)
                .send(payload);
                expect(res.status).toBe(400)
        });

        it('should return the movie if valid', async function () {
            let genre = await (new Genre({name: 'horror'})).save()
            let payload = {
                title: 'SomeName',
                genreId: genre._id,
                numberInStock: 3,
                dailyRentalRate: 2
            }
            let token = (new User()).generateAuthToken()
            const res = await request(server)
                .post(path)
                .set('x-auth-token', token)
                .send(payload);
                expect(res.body.title).toBe(payload.title)
                expect(res.body.numberInStock).toBe(payload.numberInStock)
        });
    });
})