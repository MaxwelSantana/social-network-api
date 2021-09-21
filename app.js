const express = require('express');
const app = express();
const mongoose = require('mongoose');
//middleware
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const cors = require('cors');

const fs = require('fs');

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
const userRoutes = require('./routes/user');

//middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());
app.use('/', postRoutes);
app.use('/', authRoutes);
app.use('/', userRoutes);

app.get('/', (req, res) => {
    fs.readFile('./docs/apiDocs.json', (err, data) => {
        if (err) {
            return res.status(400).json({ error: err });
        }
        const docs = JSON.parse(data);
        res.json(docs);
    });
});

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ error: 'UnauthorizedError' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`A Node.Js API is running on PORT ${PORT}`);
});
