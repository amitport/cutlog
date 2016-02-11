import mongoose from 'mongoose';
import validators from 'mongoose-validators';

const User = mongoose.model('User',
  new mongoose.Schema({
    displayName: {
      type: String,
      unique: true,
      required: true
    },
    email: {
      type: String,
      lowercase: true,
      validate: validators.isEmail(),
      unique: true,
      required: true
    },
    avatarImageUrl: {
      type: String,
      validate: validators.isURL()
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    linkedAuthProviders: {
      google: String
    }
  })
);

export default User;
