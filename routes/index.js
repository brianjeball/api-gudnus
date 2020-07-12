'use strict';

let express = require('express');

let auth = require('basic-auth');

// Construct a router instance.
const router = express.Router();
const bcrypt = require('bcryptjs');
const Sequelize = require('sequelize');

// Models
const User = require('../models/User');

// Authenticate the User - Middleware

//////////////////////////////////////////////
///   TESTING Authentication Middleware Function   /// ----------------
//////////////////////////////////////////////

const authenticateUser = (req, res, next) => {

    // Parse the user's credentials from the Authorization header.
    const credentials = auth(req);

    if (!credentials) {
        console.log(credentials)
        console.log(req)
        var err = new Error("Email and Password are required.")
        err.status = 401;
        return next(err);
    }

    if (credentials.name && credentials.pass) {
        // Tell Mongoose to set up a query to find the document with the user's email address
        User.findOne({ emailAddress: credentials.name })
            // `exec` method to perform the search and provide a callback to provide resutls
            .then(function (user, error) {
                if (!user) { // user not found in db
                    var err = new Error('User not found.');
                    err.status = 401;
                    return next(err);
                }
                // bcrypt.compare method to compare the supplied password with the hashed version
                // bcrypt.compare(credentials.pass, user.password, function (error, result) {
                //     if (result === true) {
                res.locals.user = user;
                //         console.log({
                //             name: user.firstName + user.lastName,
                //             emailAddress: user.emailAddress,
                //             id: user._id,
                //             password: user.password
                //         });
                return next();
                //     } else {
                //         var err = new Error('Wrong email or password.');
                //         //  If the password comparison fails, then return a 401 status code to the user.
                //         err.status = 401;
                //         return next(err);
                //     }
                // })
            });
    }
}

const authorizeUser = (req, res, next) => {
    if (req.body.user.authorized) {
        res.cookie('rememberme', '1', { maxAge: 900000, httpOnly: true })
    }

    res.end();
}


// Hey dude, it works!?
router.get('/', (req, res) => {

    const getAllUsers = 'SELECT * FROM users';

    // mysqlDB.query(getAllUsers, (err, rows, field) => {
    //     if (err) {
    //         console.error('Oops, some issue bro')
    //     }
    //     console.log("Connection Made");
    //     res.json(rows);
    // })

    res.send('Hello Dude!');
    // res.sendFile('/Users/brianjball/Desktop/gudnus/index.html');
    // res.end();
})

// get one User /api/users 201 - Gets a User, returns a user
router.get('/api/user', authorizeUser, (req, res, next) => {
    // const { user } = res.locals;
    // if (user) {
    //     console.log("/api/users GET -- Success");
    //     res.status(200);
    //     return res.json(user);
    // } else {
    // }
    // console.log(req)

    // Parse the user's credentials from the Authorization header.
    const credentials = auth(req);

    if (!credentials) {
        console.log(credentials)
        // console.log(req)
        var err = new Error("Email and Password are required.")
        err.status = 401;
        return next(err);
    }

    if (credentials.name && credentials.pass) {
        User.findOne({ emailAddress: credentials.name })
            .then(function (user, error) {
                if (!user) { // user not found in db
                    var err = new Error('Account not found. Please try again with the correct email and password.');
                    err.status = 401;
                    return next(err);
                } else {
                    // bcrypt.compare method to compare the supplied password with the hashed version
                    bcrypt.compare(credentials.pass, user.password, function (error, result) {
                        if (result === true) {
                            res.locals.user = user;
                            console.log({
                                name: user.firstName + user.lastName,
                                emailAddress: user.emailAddress,
                                id: user._id,
                                password: user.password
                            });
                            return next();
                        } else {
                            var err = new Error('Wrong email or password.');
                            //  If the password comparison fails, then return a 401 status code to the user.
                            err.status = 401;
                            return next(err);
                        }
                    })
                }
            });
    }


})

// POST /api/users 201 - Creates a user, sets the Location header to "/", and returns no content
router.post('/api/user', authorizeUser, (req, res, next) => {

    // Get the user from the request body.
    const user = req.body;
    console.log("\n" + user.password + "\n")
    // User.username = req.body.username
    // User.password = req.body.password

    // Hash the new user's password.
    if (user.password) {
        user.password = bcrypt.hashSync(user.password);
    }

    // Create User `create` method
    User.create(user).catch(Sequelize.ValidationError, function (err) {
        console.log(err)
        return next(err);
    }).then((result) => {
        if (result) {
            console.log({ "Notification": "/api/users POST -- Success", "User": user })
            // Set the status to 201 Created and end the response.
            // res.setHeader("Location", "/")
            res.status(201).send(user).end();
        }
    });

});

// GET /api/users 201 - Gets all users
// pull coach id from param and query for all associated with Coach ID, returns all users assocaited
router.get('/api/users', async (req, res, next) => {
    User.findAll({
        raw: true,
       }).then(users => res.json(users));
    // const users = await User.findAll().then((data) => {
    //     if (data) {
    //         // console.log(data)
    //         console.log({ "Notification": "/api/users POST -- Success" });
    //         return res.status(200).json({ users });
    //     }
    // }).catch((err) => {
    //     console.log(err);
    //     return next(err)
    // });
});


// Coach Routes for later

// router.get('/coach/home', (req, res) => {

//   const getAllUsers = 'SELECT * FROM users';

//   res.send('Hello Home!');
// })

// router.get('/coach/members', (req, res) => {

//   const getAllUsers = 'SELECT * FROM users';

//   res.send('Hello Member!');
// })

// router.get('/coach/locations', (req, res) => {

//   const getAllUsers = 'SELECT * FROM users';

//   res.send('Hello Locations!');
// })

// router.get('/coach/sessions', (req, res) => {

//   const getAllUsers = 'SELECT * FROM users';

//   res.send('Hello sessions!');
// })

// router.get('/coach/sessions/:id', (req, res) => {

//   const getAllUsers = 'SELECT * FROM users';

//   res.send('Hello session ${:id}!');
// })

module.exports = router;