const  mongoose= require('mongoose')

const UserSchema = new mongoose.Schema({
    username: {
      type: String
    },
    email: {
        type: String,
        unique : 'email already exists'
    }
})

module.exports = mongoose.model('User', UserSchema)