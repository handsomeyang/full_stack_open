const Course = (props) => (
    <>
        <Header name={props.course.name}/>
        <Content parts={props.course.parts}/>
        <Total total={props.course.parts.reduce((sum, item) => sum + item.exercises, 0)}/>
    </>
)

const Header = (props) => <h2>{props.name}</h2>

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

export default Course
