const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const dotenv = require('dotenv');
const cors = require('cors')
dotenv.config();
//new
//const bodyParser = require("body-parser");
//

const app = express();
app.use(cors());

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const stockRoutes = require('./routes/stock');
const blogRoutes = require('./routes/blog');
const globalRoutes = require('./routes/global');

//new
//const stockPriceRoutes = require('./routes/')
//

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
app.use('/api/global', globalRoutes);

//new
mongoose.set('strictQuery', false);
//

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('MongoDB Connected...');
    app.listen(process.env.PORT, () => {
        console.log('Server started on port ' + process.env.PORT);
    })
}).catch((err) => {
    console.log("Error occured " + err.message);
}) 