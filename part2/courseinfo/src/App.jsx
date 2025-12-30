const Course = (props) => (
    <>
        <Header name={props.course.name}/>
        <Content parts={props.course.parts}/>
        <Total total={props.course.parts.reduce((sum, item) => sum + item.exercises, 0)}/>
    </>
)

const Header = (props) => <h1>{props.name}</h1>

const Content = (props) => (
    <div>
        {props.parts.map(part => <Part key={part.id} part={part}/>)}
    </div>
)

const Part = (props) => (
    <p>
        {props.part.name} {props.part.exercises}
    </p>
)

const Total = (props) => <b>total of {props.total} exercises</b>

const App = () => {
    const course = {
        id: 1,
        name: 'Half Stack application development',
        parts: [
            {
                name: 'Fundamentals of React',
                exercises: 10,
                id: 1
            },
            {
                name: 'Using props to pass data',
                exercises: 7,
                id: 2
            },
            {
                name: 'State of a component',
                exercises: 14,
                id: 3
            }
        ]
    }

    return <Course course={course}/>
}

export default App