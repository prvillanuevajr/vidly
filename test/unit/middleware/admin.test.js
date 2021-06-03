const {User} = require('../../../models/User');
const admin = require('../../../middleware/admin');

describe('auth middleware', () => {
    it('should return 403 if not admin', async () => {

        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        }
        let next = jest.fn()
        let req = {
            user: {name: 'Presmelito Villanueva', email: 'prvillanuevajr@gmail.com'}
        }
        admin(req, res, next)
        expect(res.status).toBeCalledWith(403)
        expect(next).not.toHaveBeenCalled()
    });

    it('should return call next if admin', async () => {
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        }
        let next = jest.fn()
        let req = {
            user: {name: 'Presmelito Villanueva', email: 'prvillanuevajr@gmail.com', isAdmin: true}
        }
        admin(req, res, next)
        expect(next).toBeCalled()
        expect(res.status).not.toHaveBeenCalledWith(403)
    });
});