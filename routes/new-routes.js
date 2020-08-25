'use strict';

let express = require('express');
const { User } = require('../new-models/models');
// Construct a router instance.
const router = express.Router();

router.get('/api/users', async (req, res, next) => {
    // try {
    let users;

    User.find()
        .exec()
        .then((data) => {
            console.log(JSON.stringify(data, null, 2));
            users = JSON.stringify(data, null, 2);
            res.json({users: data})
        });
})

router.post('/api/user', async (req, res, next) => {
    var userData = {
        emailAddress: req.body.emailAddress,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
        roles: req.body.role,
        isActive: req.body.isActive,
        username: req.body.username
      };

      // user schema's `create` method to insert doc into Mongo
      User.create(userData, function(error, user) {
        // if error pass to error handling middleware
        if (error) {
          return next (error);
        } else { // send to profile page
          console.log("User Created - Console")
          return res.send({
              user: user,
              message: "User Created"});
        }
      })
})

router.delete('/api/user', (req, res, next) => {
    const firstName = req.body.firstName;
    User.deleteOne({"firstName": firstName}, (error, info) => {
        if (error) {
            return next (error)
        } else if (info.deletedCount >= 1) {
            console.log("User: " + firstName + " has been deleted");
            return res.send("User: " + firstName + " has been deleted");
        } else {
            return res.send("No user to delete")
        }
    })
})

module.exports = router;
