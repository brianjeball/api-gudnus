'use strict';

let express = require('express');

// let auth = require('basic-auth');

// Construct a router instance.
const router = express.Router();
// const bcryptjs = require('bcryptjs');

// Controllers
const UserController = require('../controllers/UserController')

router.get('/api/users', async (req, res, next) => {
    try {
        const users = await User.findAll();

        return res.status(200).json({ users });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: 'Internal server error' });
    }
})