const Mongoose = require('../lib/mongoose')

const UserSchema = new Mongoose.Schema({
  createdAt: { type: Date, default: new Date() },
  username: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  isLocked: { type: Boolean, default: false },
  updatedAt: { type: Date }
})

Object.assign(UserSchema.query, {
  after: function (date) {
    return this.find({ date: { '$gte': date } })
  },
  before: function (date) {
    return this.find({ date: { '$lte': date } })
  },
  byEmail: function (email) {
    return this.find({ email })
  },
  byUsername: function (username) {
    return this.find({ username })
  }
})

UserSchema.statics.getUsersInRange = ({ start, end }, done) => {
  UserModel.find()
    .after(start)
    .before(end)
    .sort({ date: -1 })
    .exec(done)
}

UserSchema.statics.findByEmail = (email, done) => {
  UserModel.find()
    .byEmail(email)
    .exec(done)
}

UserSchema.statics.findByUsername = (username, done) => {
  UserModel.find()
    .byUsername(username)
    .exec(done)
}

UserSchema.statics.findByEmailOrUsername = (email, username, done) => {
  UserModel.find({ $or: [{ email }, { username }] })
    .exec(done)
}

if (!UserSchema.options.toObject) {
  UserSchema.options.toObject = {}
}

UserSchema.options.toObject.transform = (doc, ret) => {
  ret.id = ret._id

  delete ret._id
  delete ret.__v
}

const UserModel = Mongoose.model('User', UserSchema)

module.exports = UserModel
