const mongoose = require('mongoose');
const passport = require('passport');
const _ = require('lodash');

const User = mongoose.model('User');

// Controller for user registeration.
module.exports.register = (req, res, next) => {
    //Initialising user model.
    var user = new User();
    user.fullName = req.body.fullName;
    user.email = req.body.email;
    user.password = req.body.password;
    //Saving user data.
    user.save((err, doc) => {
        if (!err)
            res.send(doc);
        else {
            if (err.code == 11000)
                res.status(422).send(['Duplicate email adrress found.']);
            else
                return next(err);
        }

    });
}

// Controller for user authenctication.
module.exports.authenticate = (req, res, next) => {
    // call for passport authentication
    passport.authenticate('local', (err, user, info) => {
        // error from passport middleware
        if (err) return res.status(400).json(err);
        // registered user
        else if (user) return res.status(200).json({ "token": user.generateJwt() });
        // unknown user or wrong password
        else return res.status(404).json(info);
    })(req, res);
}

// Controller for fetching user profile.
module.exports.userProfile = (req, res, next) => {
    //Finding user by current id.
    User.findOne({ _id: req._id },
        (err, user) => {
            if (!user)
                // If the user is not registered.
                return res.status(404).json({ status: false, message: 'User record not found.' });
            else
                // If the user has been found.
                return res.status(200).json({ status: true, user: _.pick(user, ['fullName', 'email']) });
        }
    );
}