const Persons = ({persons, deletePersonOf}) => (
    <>
        {persons.map(person => <Person name={person.name} key={person.id} number={person.number} deletePerson={() => deletePersonOf(person.id)} />)}
    </>
)

const Person = ({name, number, deletePerson}) => <div>{name} {number} <button onClick={deletePerson}>delete</button></div>

export default Persons