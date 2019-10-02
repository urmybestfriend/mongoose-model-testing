const User = require('./../user.model.js')
const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const dbtype = process.env.dbtype ? 'mongo' : 'localhost'
mongoose.connect('mongodb://' + dbtype + '/testUser', {
  useNewUrlParser: true
})
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: `)
})

describe("User Model", () => {
  it("has username and email attributes", () => {
    let expectedKeys = ["username", "email", "hashed_password", "salt"]
    let keys = Object.keys(User.schema.paths)
    let userAttributes = [keys[0], keys[1], keys[2], keys[3]]
    expect(userAttributes).toStrictEqual(expectedKeys)
  })
  it("should create a new user", async () => {
    try {
      const user = new User({
        username: "john",
        email: "john@smith.info",
        password: "qwer213"
      })
      let result = await user.save()
      expect(result.username).toEqual(user.username)
      expect(result.email).toEqual(user.email)
    } catch (err) {
      throw new Error(err)
    }
  })
  it("should throw an error if the username field is empty", async () => {
    try {
      await new User({
        username: "",
        email: "john@smith.info",
        password: "qwer213"
      }).save()
    } catch (err) {
      expect(err.errors.username.kind).toEqual("required")
    }
  })
  it("should throw an error on save if two users use the same email", async () => {
    try {
      await new User({
        username: "sam",
        email: "sam@ed.info",
        password: "qwer213"
      }).save()
      await new User({
        username: "tom",
        email: "sam@ed.info",
        password: "qzxc213"
      }).save()
    } catch (err) {
      expect(err.code).toEqual(11000)
    }
  })
  it("should throw an error if the email is invalid", async () => {
    try {
      await new User({
        username: "john",
        email: "johnsmith.info",
        password: "qwer213"
      }).save()
    } catch (err) {
      expect(err.errors.email.message).toEqual("Please give a valid email address")
    }
  })
})

describe("User Password Authentication", () => {
  it("should generate the same hash given the same password text and salt", async () => {
    try {
        let salt = User.generateSalt()
        let hash = User.generateHash("qwer213", salt)
        expect(hash).toEqual(User.generateHash("qwer213", salt))
    }
    catch (err) {
      throw new Error(err)
    }
  })
  it("should save a user with hashed_password and salt attributes", async () => {
    try {
        let result = await new User({ username: "sam", email: "sam@ed.info", password: 'qwer213'}).save()
        expect(Object.keys(result._doc)).toEqual(expect.arrayContaining( ['salt', 'hashed_password']))
    }
    catch (err) {
        throw new Error(err);
    }
  })
})

afterEach(async () => {
  try {
    await User.deleteMany({})
  } catch (err) {
    console.log(err)
  }
})
afterAll(async () => {
  try {
    await mongoose.connection.close()
  } catch (err) {
    console.log(err)
  }
})

