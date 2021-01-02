require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const MOVIES = require('./movies-data.json')
const { response } = require('express')

const app = express()

app.use(morgan('dev'))
app.use(cors())
app.use(helmet())

app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')

    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({ error: 'Unauthorized request' })
    }

    next()
})

const validMovies = {
    "filmtv_ID": 2,
    "film_title": "Bugs Bunny's Third Movie: 1001 Rabbit Tales",
    "year": 1982,
    "genre": "Animation",
    "duration": 76,
    "country": "United States",
    "director": "David Detiege, Art Davis, Bill Perez",
    "actors": "N/A",
    "avg_vote": 7.7,
    "votes": 28
  }

app.get('/movie', function handleGetMovies(req, res) {
  let response = MOVIES;  

    if (req.query.genre) {
        response = response.filter(movie =>
            movie.genre.toLowerCase().includes(req.query.genre.toLocaleLowerCase())
        )
    }

    if (req.query.country) {
        response = response.filter(movie =>
            movie.counrty.toLowerCase().includes(req.query.counrty.toLowerCase())
        )
    }

    if (req.query.avg_vote) {
        response = response.filter(movie =>
            Number(movie.avg_vote) >= Number(req.avg_vote)
        )
    }

    res.json(response)
})

const PORT = 8000

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
})