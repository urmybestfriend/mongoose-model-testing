const mongoose = require('mongoose')
const crypto = require('crypto')

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: "username is required"
  },
  email: {
    type: String,
    unique: 'email already exists',
    match: [/.+\@.+\..+/, 'Please give a valid email address']
  },
  hashed_password: {
    type: String,
    required: true
  },
  salt: String
})

UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password
    this.salt = this.model('User').generateSalt()
    this.hashed_password = this.model('User').generateHash(password, this.salt)
  })
  .get(function() {
    return this._password
  })

UserSchema.path('hashed_password').validate(function(v) {
  if (this._password && this._password.length < 6) {
    this.invalidate('password', 'Password must be at least 6 characters.')
  }
  if (this.isNew && !this._password) {
    this.invalidate('password', 'Password is required')
  }
}, null)  

UserSchema.statics.generateSalt = function() {
  return Math.round((new Date().valueOf() * Math.random())) + ''
}

UserSchema.statics.generateHash = function(password, salt) {
  try {
    const hmac = crypto.createHmac('sha1',salt)
    hmac.update(password)
    return hmac.digest('hex')
  } catch (err) {
    return err
  }
}

UserSchema.statics.authenticate = function(given_password, hashed_password, salt) {
  return UserSchema.statics.generateHash(given_password, salt) === hashed_password
}

module.exports = mongoose.model('User', UserSchema)
