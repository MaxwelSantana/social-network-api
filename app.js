const express = require('express');
const app = express();
const mongoose = require('mongoose');
//middleware
const morgan = require('morgan');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

const dotenv = require('dotenv');
dotenv.config();

//db connection
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true })
    .then(() => console.log('DB Connected'));

mongoose.connection.on('error', (err) => {
    console.log(`DB connection error: ${err.message}`);
});

const postRoutes = require('./routes/post');
const authRoutes = require('./routes/auth');

//middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(expressValidator());
app.use('/', postRoutes);
app.use('/', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`A Node.Js API is running on PORT ${PORT}`);
});
