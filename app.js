const { render } = require('ejs');
const express = require('express');
const mongoose = require('mongoose');
const Movie = require('./models/movie');

// express app
const app = express();

// connect to mongodb and listen for requests
const dbURI = "mongodb+srv://Patrik:^*cyq8pRybBVZDh@cluster0.fr2zc.mongodb.net/movieblog-database";
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err))

// register view engine
app.set('view engine', 'ejs');

// middleware & static file directory
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));

// routes
app.get('/', (req, res) => {
    res.redirect('/movies');
});

app.get('/about', (req, res) => {
    res.render('../docs/about', { title: 'About' });
});

// database routes
app.get('/movies', (req, res) => {
    Movie.find()
        .then((result) => {
            res.render('../docs/index', { title: 'All movies', movies: result });
        })
        .catch((err) => {
            console.log(err);
        });
});

app.post('/movies', (req, res) => {
    const movie = new Movie(req.body);

    movie.save()
        .then((result) => {
            res.redirect('/movies');
        })
        .catch((err) => {
            console.log(err);
        });
});

app.delete('/movies/:id', (req, res) => {
    const id = req.params.id;

    Movie.findByIdAndDelete(id)
        .then(result => {
            res.json({ redirect: '/movies' })
        })
        .catch(err => {
            console.log(err);
        })
});

app.get('/movies/create', (req, res) => {
    res.render('../docs/create', { title: 'Add a new movie' });
});

app.get('/movies/:id', (req, res) => {
    const id = req.params.id;
    Movie.findById(id)
        .then(result => {
            res.render('../docs/details', { movie: result, title: 'Movie details' });
        })
        .catch(err => {
            console.log(err);
        });
});

app.get('/single-movie', (req, res) => {
    Movie.findById('6172afb3b1cc6a955fe63242')
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        });
});

// redirects
app.get('/about-us', (req, res) => {
    res.redirect('/about');
});

// 404 page
app.use((req, res) => {
    res.status(404).render('../docs/404', { title: '404 Not Found' });
});