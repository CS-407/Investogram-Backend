const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors')
dotenv.config();

const app = express();
app.use(cors());

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const stockRoutes = require('./routes/stock');
const blogRoutes = require('./routes/blog');

// Initialize Middleware
app.use(express.urlencoded());
app.use(express.json());

app.use((req, res, next) => {
    console.log(req.url);
    next();
});

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/blog', blogRoutes);

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('MongoDB Connected...');
    app.listen(process.env.PORT, () => {
        console.log('Server started on port ' + process.env.PORT);
    })
}).catch((err) => {
    console.log("Error occured " + err.message);
})