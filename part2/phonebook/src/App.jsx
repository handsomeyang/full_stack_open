import { useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
    const [persons, setPersons] = useState([
        { name: 'Arto Hellas', number: '040-123456', id: 1 },
        { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
        { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
        { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
    ])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [newFilter, setNewFilter] = useState('')

    const handleNameChange = (event) => {
        console.log(event.target.value)
        setNewName(event.target.value)
    }

    const handleNumberChange = (event) => {
        console.log(event.target.value)
        setNewNumber(event.target.value)
    }

    const handleFilterChange = (event) => {
        console.log(event.target.value)
        setNewFilter(event.target.value)
    }

    const addPerson = (event) => {
        event.preventDefault()

        if (persons.some(person => person.name === newName)) {
            alert(`${newName} is already added to phonebook`)
        }
        else {
            const personObject = {
                name: newName,
                number: newNumber
            }
            setPersons(persons.concat(personObject))
            setNewName('')
            setNewNumber('')
        }
    }

    const personsToShow = persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))

    return (
        <div>
            <h1>Phonebook</h1>
            <Filter value={newFilter} onChange={handleFilterChange} />
            <h2>Add a new</h2>
            <PersonForm onSubmit={addPerson} name={newName} onNameChange={handleNameChange} number={newNumber} onNumberChange={handleNumberChange} />
            <h2>Numbers</h2>
            <Persons persons={personsToShow}/>
        </div>
    )
}

export default App