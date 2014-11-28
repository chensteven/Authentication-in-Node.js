var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var userSchema = new mongoose.Schema({
	
	local: {
		username: {
			type: String,
			required: true,
			trim: true,
			lowercase: true,
			unique: true
		},
		password: {
			type: String,
			required: true,
			trim: true
		}
	},
	facebook: {
		id: {
			type: String
		},
		token: {
			type: String
		},
		displayName: {
			type: String
		},
		username: {
			type: String
		}

	},
	joined: {
		type: Date,
		default: Date.now
	},
	email: {
		type: String,
		trim: true,
		lowercase: true
	}
});

userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};
userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);