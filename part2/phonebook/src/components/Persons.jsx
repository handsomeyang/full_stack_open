const Persons = ({persons}) => (
    <>
        {persons.map(person => <Person name={person.name} key={person.id} number={person.number}/>)}
    </>
)

const Person = ({name, number}) => <div>{name} {number}</div>

export default Persons