const User = require('./../user.model.js')
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
dbtype = process.env.dbtype ? 'mongo' : 'localhost'
mongoose.connect('mongodb://' + dbtype + '/testUser', { useNewUrlParser: true });
mongoose.connection.on('error', () => {
    throw new Error(`unable to connect to database: `);
})

describe("User Model", () => {
    it("has username and email attributes", () => {
        let expectedKeys = ["username", "email"]
        let keys = Object.keys(User.schema.paths)
        let userAttributes = [keys[0], keys[1]]
        expect(userAttributes).toStrictEqual(expectedKeys)
    })
    it("should create a new user ", async () => {
        try {
            const user = new User({username: "john", email: "john@smith.info"});
            let result = await user.save();
            expect(result.username).toEqual(user.username);
            expect(result.email).toEqual(user.email);
        }
        catch (err) {
            throw new Error(err);
        }
    })
})
afterEach(async () => {
    try {
        await User.deleteMany({});
    }
    catch (err) {
        console.log(err);
    }
})
afterAll(async () => {
    try {
        await mongoose.connection.close();
    }
    catch (err) {
        console.log(err);
    }
})