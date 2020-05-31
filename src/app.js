const path = require('path');
const express = require('express');
const hbs = require('hbs');

const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();

// Define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public'); 
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');


// Set up hbs engine and view location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Set up static directory to serve
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Claudio'
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me',
        name: 'Claudio'
    });
});

app.get('/help', (req, res) => {
    res.render('help', {
        helptext: 'This is some useful help text',
        title: 'Help',
        name: 'Claudio'
    });
});

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address'
        });
    }
    geocode(req.query.address, (error, { latitude, longitude, location } = {} ) => {
        if (error) {
            return res.send({
                error
            });
        }
        forecast(latitude, longitude, (error, { descriptions, temperature, feelslike }) => {
            if (error) {
                return res.send({
                    error
                });
            }
            return res.send({
                location,
                description: descriptions[0],
                temperature,
                feelslike
            });
        });
    });    
});

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        });
    }
    res.send({
        products: []
    });
});

app.get('/help/*', (req, res) => {
    res.render('notfound',{
        errorMessage: 'Help article not found',
        title: '404',
        name: 'Claudio'
    });
});

app.get('*', (req, res) => {
    res.render('notfound',{
        errorMessage: 'Page not found',
        title: '404',
        name: 'Claudio'
    });
});

app.listen(3000, () => {
    console.log('server is up at 3000');
});