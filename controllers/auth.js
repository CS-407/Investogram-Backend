const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

const dotenv = require('dotenv');
dotenv.config();

exports.login = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email: email });

        if (!existingUser) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const isEqual = await bcrypt.compare(password, existingUser.password);

        if (!isEqual) {
            return res.status(401).json({ msg: 'Password incorrect' });
        }
 
        const payload = {
            user: {
                id: existingUser._id
            }
        }

        jwt.sign(
            payload,
            process.env.SECRET,
            {
                expiresIn: 3600
            },
            (err, token) => {
                if (err) throw err;
                res.status(200).json({ token: token, user: existingUser })
            }
        )
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
}

exports.signup = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, username, password, password2 } = req.body;

    if (password !== password2) {
        return res.status(401).json({ msg: 'Passwords do not match' })
    }

    try {
        const existingUser = await User.findOne({ email: email });

        if (existingUser) {
            console.log('\tExisting User - ');
            return res.status(401).json({ msg: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = new User({
            email: email,
            username: username,
            password: hashedPassword
        });

        await newUser.save();

        // Sign in user with jwt
        const payload = {
            user: {
                id: newUser.id
            }
        }

        jwt.sign(
            payload,
            process.env.SECRET,
            {
                expiresIn: 3600
            },
            (err, token) => {
                if (err) throw err;
                res.status(200).json({ user: newUser, token })
            }
        )
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
}

exports.verify = async (req, res) => {
    try {

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
}

exports.forgotpass = async (req, res) => {
    try {

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
}

exports.resetuser = async (req, res) => {
    console.log("Check Reset User");
    try {
        const email = req.body.email;
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        const newusername = req.body.newusername;
        const checkUsername = await User.findOne({username: newusername});
        if (checkUsername) {
            return res.status(404).json({ msg: 'Username Taken' });
        }
        user.username = newusername;
        user.save();
        console.log("Success");
        res.status(200).json({ msg: 'Success' });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
}

exports.resetpass = async (req, res) => {
    try {

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
}