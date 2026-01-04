require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()

app.use(express.json())
app.use(express.static('dist'))
app.set('view engine', 'ejs');

morgan.token('data', function (req, res) {
    return req.method === 'POST' ? JSON.stringify(req.body) : ''
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response) => {
     Person.findById(request.params.id).then(person => {
        response.json(person)
    })
})

app.delete('/api/persons/:id', (request, response) => {
    Person.deleteOne(request.params.id).then(person => {
        response.status(204).end()
    })
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'Name or number missing'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

app.get('/info', (request, response) => {
    Person.countDocuments({}).then(personCount => {
        const now = new Date();

        // Create a formatter with detailed options
        const formatter = new Intl.DateTimeFormat('en-US', {
            weekday: 'long',    // "Friday"
            year: 'numeric',    // "2026"
            month: 'long',      // "January"
            day: 'numeric',     // "2"
            hour: '2-digit',    // "09"
            minute: '2-digit',  // "08"
            second: '2-digit',  // "34"
            timeZoneName: 'long' // "EST" or "GMT-5"
        });

        const data = {
            personCount: personCount,
            requestTime: formatter.format(now)
        };

        response.render('info', data);
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})