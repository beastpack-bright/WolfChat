const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const { create } = require('express-handlebars');
const session = require('express-session');
const routes = require('./routes');
const RedisStore = require('connect-redis').default;
const { createClient } = require('redis');
require('dotenv').config();

const port = process.env.PORT || 3000;
const app = express();

const redisClient = createClient({
    url: process.env.REDIS_URL
});

// Middleware setup - in correct order
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`)));

// Redis setup
redisClient.connect().catch(console.error);
app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24
    }
}));

// Handlebars setup
const hbs = create({
    extname: '.handlebars',
    defaultLayout: 'main',
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '../views'));

// MongoDB connection
mongoose.connect('mongodb+srv://eas2062:wolves963@eas2062.n6uks.mongodb.net/WolfChat?retryWrites=true&w=majority')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB:', err));

// Routes
app.use('/', routes);

app.listen(port, (err) => {
    if (err) throw err;
    console.log(`WolfChat is running on port ${port}`);
});