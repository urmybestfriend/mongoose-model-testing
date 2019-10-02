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
  }
})

UserSchema.statics.generateSalt = function(){
  return Math.round((new Date().valueOf() * Math.random())) + ''
}

UserSchema.statics.generateHash =  function(password, salt) {
  try {
    const hmac = crypto.createHmac('sha1',salt)
    hmac.update(password)
    return hmac.digest('hex')
  } catch (err) {
    return err
  }
}

module.exports = mongoose.model('User', UserSchema)
