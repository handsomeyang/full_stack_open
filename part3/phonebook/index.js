const express = require('express')
const morgan = require('morgan')

const app = express()

app.use(express.json())
app.set('view engine', 'ejs');

morgan.token('data', function (req, res) {
    return req.method === 'POST' ? JSON.stringify(req.body) : ''
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

let persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const generateId = () => {
    let id;
    existingSet = new Set(persons.map(person => person.id))

    do {
        id = Math.floor(Math.random() * 1000000) + 1;
    } while (existingSet.has(id));

    return id;
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'Name or number missing'
        })
    }

    if (persons.some(person => person.name === body.name)) {
        return response.status(400).json({
            error: 'Name already exists in the phonebook'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }

    persons = persons.concat(person)

    response.json(person)
})

app.get('/info', (request, response) => {
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
        personCount: persons.length,
        requestTime: formatter.format(now)
    };

    response.render('info', data);
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})