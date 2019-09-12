const  mongoose= require('mongoose')

const UserSchema = new mongoose.Schema({
    username: {
      type: String,
      required: "username is required"
    },
    email: {
        type: String,
        unique : 'email already exists'
    }
})

module.exports = mongoose.model('User', UserSchema)