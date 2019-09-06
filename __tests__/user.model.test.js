const User = require('./../user.model.js')
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
dbtype = process.env.dbtype ? 'mongo' : 'localhost'
mongoose.connect('mongodb://' + dbtype + '/testUser', { useNewUrlParser: true });
mongoose.connection.on('error', () => {
    throw new Error(`unable to connect to database: `);
})

describe("User Model", () => {
    it("has username and email attributes", async () => {
        let expectedKeys = ["username", "email"]
        let keys = Object.keys(User.schema.paths)
        let userAttributes = [keys[0], keys[1]]
        expect(userAttributes).toStrictEqual(expectedKeys)
    })
})

afterAll(async () => {
    try {
        await mongoose.connection.close();
    }
    catch (err) {
        console.log(err);
    }
})