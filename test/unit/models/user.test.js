const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');
const {User} = require('../../../models/User')
describe('user', function () {
    it('should return a valid token', function () {
        const payload = {_id: new mongoose.Types.ObjectId().toHexString(), name: 'Presmelito Villanueva'}
        const user = new User(payload)
        const token = user.generateAuthToken();
        expect(token).toBeDefined()
        const userDetails = jwt.verify(token,config.get('jwtPrivateKey'))
        expect(userDetails).toMatchObject(payload);
    });
})