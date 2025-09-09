const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');


const signupSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["Manager" ,"Sales-Agent"], 
      required:true,    
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      // match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      // match: [/^[+0-9\s-]{7,}$/, "Please provide a valid phone number"],
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    // password: {
    //   type: String,
    //   required: true,
    // },
  },
  
  { timestamps: true }
);

// Export Model
signupSchema.plugin(passportLocalMongoose, {
  usernameField: "email"
}); //helps us to capture the data from the user


module.exports = mongoose.model('User', signupSchema)