const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name:{ type: String, required: true },
    industry:{ type: String, required: true },
    mobile:{ type: String, required: true },
    email:{ type: String, required: true },
    verified:{type:Boolean,required:true}
});

const User = mongoose.model('User',UserSchema);

module.exports = User;
