import { useState, useEffect } from 'react'
import personService from './services/persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'

const App = () => {
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [newFilter, setNewFilter] = useState('')
    const [message, setMessage] = useState(null)

    useEffect(() => {
        personService
            .getAll()
            .then(initialPersons => {
                setPersons(initialPersons)
            })
    }, [])

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
        const personObject = {
            name: newName,
            number: newNumber
        }

        const foundPerson = persons.find(person => person.name.toLowerCase() === newName.toLowerCase())
        if (foundPerson) {
            if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
                personService
                    .update(foundPerson.id, personObject)
                    .then(returnedPerson => {
                        setPersons(persons.map(person => person.id === foundPerson.id ? returnedPerson : person))
                        setNewName('')
                        setNewNumber('')
                        setMessage({content: `Updated ${returnedPerson.name}'s number`, error: false})
                        setTimeout(() => {
                            setMessage(null)
                        }, 3000)
                    })
                    .catch(error => {
                        console.log(error.response.data.error)

                        setNewName('')
                        setNewNumber('')
                        setMessage(
                            {content: `Error updating ${newName}`, error: true}
                        )
                        setTimeout(() => {
                            setMessage(null)
                        }, 3000)
                    })
            }
        }
        else {
            personService
                .create(personObject)
                .then(returnedPerson => {
                    setPersons(persons.concat(returnedPerson))
                    setNewName('')
                    setNewNumber('')
                    setMessage({content: `Added ${returnedPerson.name}`, error: false})
                    setTimeout(() => {
                        setMessage(null)
                    }, 3000)
                })
                .catch(error => {
                    console.log(error.response.data.error)

                    setNewName('')
                    setNewNumber('')
                    setMessage(
                        {content: error.response.data.error, error: true}
                    )
                    setTimeout(() => {
                        setMessage(null)
                    }, 3000)
                })
        }
    }

    const deletePersonOf = id => {
        const selectedPerson = persons.find(person => person.id === id)

        if (window.confirm(`Delete ${selectedPerson.name}?`)) {
            personService
                .remove(id)
                .then(() => {
                    setPersons(persons.filter(person => person.id !== id))
                    setMessage({content: `Deleted ${selectedPerson.name}`, error: false})
                    setTimeout(() => {
                        setMessage(null)
                    }, 3000)
                })
                .catch(error => {
                    setPersons(persons.filter(person => person.id !== id))
                    setMessage(
                        {content: `Error deleting ${selectedPerson.name}`, error: true}
                    )
                    setTimeout(() => {
                        setMessage(null)
                    }, 3000)
                })
        }
    }

    const personsToShow = persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))

    return (
        <div>
            <h1>Phonebook</h1>
            <Notification message={message} />
            <Filter value={newFilter} onChange={handleFilterChange} />
            <h2>Add a new</h2>
            <PersonForm onSubmit={addPerson} name={newName} onNameChange={handleNameChange} number={newNumber} onNumberChange={handleNumberChange} />
            <h2>Numbers</h2>
            <Persons persons={personsToShow} deletePersonOf={deletePersonOf} />
        </div>
    )
}

export default App