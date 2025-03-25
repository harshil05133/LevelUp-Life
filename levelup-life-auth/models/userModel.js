// Mongoose connects Node.js to MongoDB and provides an API to work with MongoDB documents
// Import bcryptjs, a library used for hashing passwords
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');




// Create a new mongoose schema that defines the structure of the User document in MongoDB
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

//middleware function that runs before presaving a document
//mongoose hook that allows executing code before certain operations

//check if the password field is modified before hashing it, 
//to avoid hashing the password multiple times if other fields are updated
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) { //'this' refers to the document(user) being saved
    return next(); //skip hashing if password wasnt changed
  }
  //generate random string that makes hash unpredictable
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Create a model from the schema
// The model provides an interface to the database for creating, querying, updating, deleting records, etc.
// 'User' is the name of the model and will be used to create a collection named 'users' in MongoDB
const User = mongoose.model('User', userSchema);

module.exports = User;