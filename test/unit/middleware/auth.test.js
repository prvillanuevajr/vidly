const {User} = require('../../../models/User');
const auth = require('../../../middleware/auth');

describe('auth middleware', () => {
    it('should populate req.user with the payload of a valid JWT', async () => {
        const user = new User({name: 'Presmelito Villanueva', email: 'prvillanuevajr@gmail.com'})
        const token = user.generateAuthToken();
        let res = jest.fn()
        let next = jest.fn()
        let req = {
            header: jest.fn().mockReturnValue(token)
        }
        auth(req,res,next)
        expect(req.user).toHaveProperty(['name']);
    });
});