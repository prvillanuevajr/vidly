const request = require('supertest');
const mongoose = require("mongoose");
const {User} = require("../../models/User");
const {Genre} = require('../../models/genre');

let server;

describe('/api/genres', function () {
    beforeEach(() => {
        server = require('../../index');
    })
    afterEach(async () => {
        await Genre.deleteMany({});
        await server.close();
    });
    describe('GET /', function () {
        it('should return all genres', async function () {
            await (new Genre({name: 'horror'})).save()
            await (new Genre({name: 'horror'})).save()
            const result = await request(server).get('/api/genres')
            expect(result.status).toBe(200)
            expect(result.body.length).toBe(2)
        });
    })

    describe('GET /:id', () => {
        it('should return a genre if input is valid id', async () => {
            const genre = new Genre({ name: 'genre1' });
            await genre.save()

            const res = await request(server).get('/api/genres/' + genre._id);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genre.name);
        });

        it('should return 404 if invalid input is valid id', async () => {
            const res = await request(server).get('/api/genres/1');

            expect(res.status).toBe(404);
        });

        it('should return 404 if no genre with the given id exists', async () => {
            const id = mongoose.Types.ObjectId();
            const res = await request(server).get('/api/genres/' + id);

            expect(res.status).toBe(404);
        });
    });
    
    describe('POST /', function () {
        it('should return 401 if client is not logged in', async () => {
            let name;
            let token;
            token = '';

            const res = await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ name });;

            expect(res.status).toBe(401);
        });

        it('should return 400 if genre is less than 5 characters', async () => {
            let name = '';
            let token = (new User).generateAuthToken();

            const res = await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ name });;

            expect(res.status).toBe(400);
        });

        it('should return 400 if genre is more than 50 characters', async () => {
            let name = new Array(52).join('a');
            let token = (new User).generateAuthToken();

            const res = await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ name });;

            expect(res.status).toBe(400);
        });

        it('should save the genre if it is valid', async () => {
            let name = new Array(45).join('a');
            let token = (new User).generateAuthToken();
            const res = await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ name });;

            const genre = await Genre.find({ name: 'genre1' });

            expect(genre).not.toBeNull();
        });

        it('should return the genre if it is valid', async () => {
            let name = new Array(45).join('a');
            let token = (new User).generateAuthToken();
            const res = await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ name });;

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', name);
        });
    })

    describe('PUT /:id', () => {
        let token;
        let newName;
        let genre;
        let id;

        const exec = async () => {
            return await request(server)
                .put('/api/genres/' + id)
                .set('x-auth-token', token)
                .send({ name: newName });
        }

        beforeEach(async () => {
            // Before each test we need to create a genre and
            // put it in the database.
            genre = new Genre({ name: 'genre1' });
            await genre.save();

            token = new User().generateAuthToken();
            id = genre._id;
            newName = 'updatedName';
        })

        it('should return 401 if client is not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 400 if genre is less than 5 characters', async () => {
            newName = '1234';

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if genre is more than 50 characters', async () => {
            newName = new Array(52).join('a');

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 404 if id is invalid', async () => {
            id = 1;

            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 404 if genre with the given id was not found', async () => {
            id = mongoose.Types.ObjectId();

            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should update the genre if input is valid', async () => {
            await exec();

            const updatedGenre = await Genre.findById(genre._id);

            expect(updatedGenre.name).toBe(newName);
        });

        it('should return the updated genre if it is valid', async () => {
            const res = await exec();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', newName);
        });
    });

    describe('DELETE /:id', () => {
        let token;
        let genre;
        let id;

        const exec = async () => {
            return await request(server)
                .delete('/api/genres/' + id)
                .set('x-auth-token', token)
                .send();
        }

        beforeEach(async () => {
            // Before each test we need to create a genre and
            // put it in the database.
            genre = new Genre({ name: 'genre1' });
            await genre.save();

            id = genre._id;
            token = new User({ isAdmin: true }).generateAuthToken();
        })

        it('should return 401 if client is not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 403 if the user is not an admin', async () => {
            token = new User({ isAdmin: false }).generateAuthToken();

            const res = await exec();

            expect(res.status).toBe(403);
        });

        it('should return 404 if id is invalid', async () => {
            id = 1;

            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 404 if no genre with the given id was found', async () => {
            id = mongoose.Types.ObjectId();

            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should delete the genre if input is valid', async () => {
            await exec();

            const genreInDb = await Genre.findById(id);

            expect(genreInDb).toBeNull();
        });

        it('should return the removed genre', async () => {
            const res = await exec();

            expect(res.body).toHaveProperty('_id', genre._id.toHexString());
            expect(res.body).toHaveProperty('name', genre.name);
        });
    })
})

