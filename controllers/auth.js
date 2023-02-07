const User = require('../models/user');
const jwt = require('jsonwebtoken');

const dotenv = require('dotenv');
dotenv.config();

exports.login = async (req, res) => {
    const {} = req.body;

    try {

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
}

exports.signup = async (req, res) => {
    console.log(req.body);

    const { email, username, password, password2 } = req.body;

    if (password !== password2) {
        console.log('\tPassword mismatch');
        return res.status(401).json({ msg: 'Passwords do not match' })
    }

    try {
        const existingUser = await User.findOne({ email: email });

        if (existingUser) {
            console.log('\tExisting User - ');
            return res.status(401).json({ msg: 'User already exists' });
        }

        const newUser = new User({
            email: email,
            username: username,
            password: password
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
                res.status(200).json({ user: { email: newUser.email, username: newUser.username }, token })
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

exports.forgot = async (req, res) => {
    try {

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
}

exports.reset = async (req, res) => {
    try {

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
}