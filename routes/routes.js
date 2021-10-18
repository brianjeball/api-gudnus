'use strict';

let express = require('express');
const { User, Session, Account, Profile, SessionForm } = require('../models/models');
// Construct a router instance.
const auth = require('basic-auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

/**
 * Authorize User with Token sent with Request
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const authUser = async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '')
    const data = jwt.verify(token, process.env.JWT_KEY)
    try {
        const user = await User.findOne({ _id: data._id, 'tokens.token': token })
            .populate('account')
            .populate('account.user.id')
            .populate('profile')
            .populate('account.sessions.session')
        if (!user) {
            throw new Error()
        }
        req.user = user
        req.token = token
        next()
    } catch (error) {
        res.status(401).send({ error: 'Not authorized to access this resource' })
    }
}

/**
 * DEPRECIATED: Authenticate user with username and password sent over Basic Authentication Header
 *
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next 
 */
const authenticateUser = (req, res, next) => {
    // Parse the user's credentials from the Authorization header.
    const credentials = auth(req);

    if (!credentials) {
        var err = new Error("Email and Password are required.")
        err.status = 401;
        return next(err);
    }

    if (credentials.name && credentials.pass) {
        // Tell Mongoose to set up a query to find the document with the user's email address
        User.findOne({ username: credentials.name })
            .populate('profile')
            .populate('account')
            .populate('account.sessions.session')
            // `exec` method to perform the search and provide a callback to provide resutls
            .exec(function (error, user) {
                if (error) {
                    return next(error);
                } else if (!user) { // user not found in db
                    return res.status(401).send('User not Found');
                }
                // bcrypt.compare method to compare the supplied password with the hashed version
                bcrypt.compare(credentials.pass, user.password, async (error, result) => {
                    if (result === true) {
                        res.locals.user = user;
                        return next();
                    } else {
                        //  If the password comparison fails, then return a 401 status code to the user.
                        return res.status(401).send('Wrong email or password.');
                    }
                })
            });
    }
}

/**
 * Middleware to find a specific session, for the Admin page
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const getOneSession = (req, res, next) => {
    try {

    } catch (err) {
        return next(error);
    }
}

/**
 * Middleware to find all Sessions and store in response locals for subsequent requests.
 *
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const getAllSessions = (req, res, next) => {
    try {
        // fix this - come back
        Session.find()
            .populate('user')
            .exec(function (error, sessions) {
                if (error) {
                    return next(error)
                } else if (!sessions) {
                    return next(new Error("No Sessions found"))
                }
                res.locals.sessions = sessions;
                return next();
            })
    } catch (error) {
        return next(error)
    }
}

/**
 * Middleware to find all existing Users and store in response locals for subsequent requests.
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const getAllUsers = (req, res, next) => {
    try {
        User.find()
            .exec(function (error, users) {
                if (error) return next(error);
                if (!users) return next(new Error("No Users found"));
                res.locals.allExistingUsers = users;
                return next();
            })
    } catch (error) {
        return next(error)
    }
}

/**
 * Add a User to all existing Sessions.
 * This is called when a new User is created.
 *
 * @param {array} allSessions
 * @param {string} userId
 */
async function addNewUserToSessions(allSessions, userId) {
    allSessions.forEach(async session => {
        await Session.updateOne(
            { _id: session._id },
            {
                $push: {
                    members: [{ member: userId }]
                }
            })
    });
}

/**
 * Remove User from User field of Each existing Session
 *
 * @param {*} allSessions
 * @param {*} userId
 */
async function removeUserFromAllSessions(allSessions, userId) {
    allSessions.forEach(async session => {
        try {
            await Session.updateOne(
                { _id: session._id },
                {
                    $pull: {
                        members: { member: userId }
                    }
                }
            )
        } catch (error) {
            return error;
        }
    })
}

// Create Sessions
router.post('/api/sessions', getAllUsers, authUser, async (req, res, next) => {
    const { allExistingUsers } = res.locals;
    const { user } = req;
    const sessionData = {
        user: user._id,
        title: req.body.title,
        description: req.body.description
    }

    const allUsersIds = [];
    allExistingUsers.forEach(user => {
        allUsersIds.push({ member: user._id });
    });

    const session = new Session(sessionData);
    session.members = allUsersIds;

    await session.save((err) => {
        if (err) return next(err)
    })
    res.status(201).send({ session })
})

router.get('/api/account/sessions', authUser, async (req, res) => {
    const { user } = req;

    const account = await Account.findOne({ user: { id: user._id } })
        .populate([
            {
                path: 'sessions.session',
                model: 'Session',
                select: 'title description',
                populate: {
                    path: 'members.member', // change to Profile
                    model: 'Account',
                    select: '',
                    populate: {
                        path: 'member.user',
                        model: 'User',
                        select: "username"
                    }
                }
            },
        ])

    res.status(200).send({ sessions: account.sessions })
});

// Get Sessions
router.get('/api/sessions', getAllSessions, authUser, async (req, res) => {
    const allCurrentSessions = res.locals.sessions ? res.locals.sessions : [];
    res.status(200).send(allCurrentSessions)
})

// Get A Session
router.get('/api/session/:session_id', authUser, async ( req, res, next) => {
    try {
        // Put One Session
        Session.findById(req.params.session_id)
            .populate('user')
            .exec(function (error, session) {
                if (error) {
                    return next(error)
                } else if (!session) {
                    return next(new Error(`Session with ID ${req.params.session_id} not found`))
                }
                // return One Session
                res.status(200).send(session);
            })
    } catch (error) {
        return next(error)
    }
})


// Get Auth User
router.get('/api/user', authUser, async (req, res) => {
    const { user } = req;
    return res.status(200).send({ user })
})

// Get all Users
router.get('/api/users', authUser, async (req, res, next) => {

    try {
        const users = await User.find().populate('roles', 'account')
            .populate('profile')

        res.status(200).send({ users: users })
    } catch (err) {
        next(err)
    }
})

// Register User
router.post('/api/users', getAllSessions, async (req, res, next) => {
    var userData = {
        username: req.body.username,
        emailAddress: req.body.emailAddress,
        isActive: req.body.isActive,
        password: req.body.password,
        role: req.body.role
    };
    const allCurrentSessions = res.locals.sessions ? res.locals.sessions : [];

    try {
        const user = new User(userData);
        let accountId;

        // Create Profile
        const profile = new Profile({
            userId: user._id, // may not need it with changes in Session.members.member model
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            address: {
                street_1: '',
                city: '',
                state: '',
                zipcode: '',
            },
            phoneNumber: '',
            gender: '',
            userType: req.body.role ? req.body.role : 'Member'
        })

        await profile.save(function (err) {
            if (err) return next(err)
        })

        // add profile to user
        user.profile = profile._id;

        // create associated Account
        const account = new Account(
            {
                user: { id: user._id },
                isVerified: true,
            }
        );
        // account.sessions = account.sessions.concat(allCurrentSessions)
        allCurrentSessions.forEach(session => {
            account.sessions.push({ session: session._id, isComplete: false })
        });
        await account.save(function (err) {
            if (err) return next(err)
        });
        // set account id
        accountId = account._id;

        // add account to new user
        user.account = accountId;

        // update Sessions with new User
        try {
            // related to change in Session.members.member model to user User as refernce Model for member field
            addNewUserToSessions(allCurrentSessions, user._id);
        } catch (err) {
            next(err)
        }

        // generate Token
        const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY)
        user.tokens = user.tokens.concat({ token })

        await user.save(function (err) {
            if (err) return next(err)
            res.status(201).send({ user })
        })
    } catch (error) {
        return res.status(400).send(JSON.stringify(error))
    }
})

// Member Update Member Profile
router.put('/api/users/account', authUser, async (req, res, next) => {
    const { user } = req;
    const accountData = {
        name: req.body.name,
        isVerified: req.body.isVerified,
    }
    await Account.updateOne({ user: user._id }, accountData, (err, account) => {
        if (err) {
            return next(err)
        } else if (!account) {
            return next(new Error('Account not found'))
        }
        res.status(200).json(account)
    });
})

// Login
router.post('/api/users/login', authenticateUser, async (req, res) => {
    const { user } = res.locals;
    const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY)
    user.tokens = user.tokens.concat({ token })
    await user.save()
    // send token
    res.send({ user, token });
})

// GET Users profile
router.get('/api/users/profile', authUser, async (req, res) => {
    const { user } = req;

    // const profile = await Profile.findOne({user: user._id});
    res.status(200).send({ profile: user.profile, username: user.username, emailAddress: user.emailAddress })
})

// Update - PUT Users profile
router.put('/api/users/profile', authUser, async (req, res, next) => {
    const { user } = req;

    await Profile.updateOne({ _id: user.profile }, req.body, (err, profile) => {
        if (err) return next(err);
        if (!profile) {
            return res.status(404).send('User Profile not found.')
        }
        return res.status(204).send('User profile updated')
    });
})

router.get('/api/users/sessions', authUser, async (req, res, next) => {
    const { user } = req;

    (await Account.findOne({ user: { id: user._id } })
        .populate('sessions')
        .exec((err, account) => {
            if (err) return next(err)
            if (!account) {
                return next(new Error("No Account Found"))
            }

            res.status(200).send({ account: account })
        }))
})

// Users Logout
router.post('/api/users/logout', authUser, (req, res) => {
    try {
        const { user } = req;
        user.tokens = user.tokens.filter((token) => {
            return token.token != req.token
        })
        user.save()
        res.send(user)
    } catch (error) {
        res.status(500).send(error)
    }
})

// Users Logout from all devices
router.post('/api/users/logoutall', authUser, async (req, res) => {
    try {
        const { user } = req;
        user.tokens.splice(0, user.tokens.length)
        await user.save()
        res.status(200).send(user)
    } catch (error) {
        res.status(500).send(error)
    }
})

// MEMBER //

router.get('/api/profile', authUser, async (req, res) => {
    const { user } = req;
    user.populate('profile').execPopulate()

    return res.status(200).send(user)
})

router.post('/api/user/:account_id/sessions/:session_id/form/create', authUser, (req, res, next) => {
    const { user } = req;
    let foundMemberProfile;

    try {
        const user = User.findOne({ account: req.params.account_id }).populate('profile')
        foundMemberProfile = user.profile.firstName;
    } catch (err) {
        return next(err)
    }

    const sessionForm = new SessionForm({
        userCreated: {
            id: user._id,
            name: user.profile.firstName,
            time: Date.now()
        },
        // SessionForm is created on behalf of this member
        memberAccount: req.params.account_id,
        session: req.params.session_id,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        totalTime: req.body.totalTime,
        sessionDate: req.body.sessionDate,
        serviceProvided: req.body.serviceProvided,
        sessionLocation: req.body.serviceLocation,
        memberApperance: req.body.memberApperance,
        environmentAppearance: req.body.environmentAppearance,
        memberMood: req.body.memberMood,
        memberEyeContact: req.body.memberEyeContact,
        memberJudgement: req.body.memberJudgement,
        memberCooperation: req.body.memberCooperation,
        intervention: req.body.intervention,
        coachWill: req.body.coachWill,
        coachWillContinue: req.body.coachWillContinue,
        memberProgress: req.body.memberProgress,
    })

    sessionForm.save((err) => {
        if (err) return next(err);
    })

    // const session = await Session.findById(req.params.session_id).where({members: {member: req.params.account_id}}).exec((err, session) => {
    //     if (err) return next(err)
    //     if (!session) return next(new Error('Oops, no session with that id.'))
    // })

    // const account = (await Account.findOne(member.account).where({ sessions: { _id: req.params.session_id } })
    //     .populate('sessions.session')
    //     .exec((err, account) => {
    //         if (err) return next(err)
    //         if (!account) {
    //             return next(new Error("No Account Found"))
    //         }

    //         res.status(200).send({ account: account.sessions._id === '5f62b6599db5479479a01620' })
    //     }))

    res.status(201).send({ sessionForm, memberName: foundMemberProfile });
})

router.get('/api/user/:account_id/sessions', authUser, async (req, res, next) => {
    (await Account.findById(req.params.account_id)
        .populate('sessions.session')
        .exec((err, account) => {
            if (err) return next(err)
            if (!account) {
                return next(new Error("No Account Found"))
            }

            res.status(200).send({ account: account })
        }))
})

// add middleware to check if user is admin or has role permission for this route
router.delete('/api/user/:member_id', getAllSessions, authUser, async (req, res, next) => {
    const memberId = req.params.member_id;
    const { sessions } = res.locals;
    let response = { user: null, account: null, profile: null };
    let foundUser;

    try {
        await User.findOneAndDelete(memberId, (err, user) => {
            if (err) return next(err);
            if (!user) return next(new Error("No User Found"))
            if (user) {
                response.user = 'deleted';
                foundUser = user;
            }
        });
    } catch (err) {
        return next(err)
    }

    if (foundUser) {
        // User has the follow associated documents: account, profile, in sessions.member.member
        await Account.findOneAndDelete(foundUser.account, (err, account) => {
            if (err) return next(err);
            if (!account) return next(new Error("No Account Found"));
            if (account) response.account = 'deleted';
        });

        await Profile.findOneAndRemove(foundUser.profile, (err, profile) => {
            if (err) return next(err);
            if (!profile) return next(new Error("No Profile Found"));
            if (profile) response.profile = 'deleted';
        });

        // remove foundUser from
        try {
            removeUserFromAllSessions(sessions, foundUser._id)
        } catch (error) {
            return next(error)
        }
    }

    res.status(200).json(response)
})

module.exports = router;
