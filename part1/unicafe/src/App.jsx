import {useState} from 'react'

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>

const StatisticsLine = ({text, value}) => <p>{text} {value}</p>

const Statistics = (props) => {
    if (props.all === 0)
        return (<p>No feedback given</p>)

    return (
        <>
            <StatisticsLine text='good' value={props.good} />
            <StatisticsLine text='neutral' value={props.neutral} />
            <StatisticsLine text='bad' value={props.bad} />
            <StatisticsLine text='all' value={props.all} />
            <StatisticsLine text='average' value={props.average} />
            <StatisticsLine text='positive' value={props.positive + ' %'} />
        </>
    )
}

const App = () => {
    // save clicks of each button to its own state
    const [good, setGood] = useState(0)
    const [neutral, setNeutral] = useState(0)
    const [bad, setBad] = useState(0)
    const [all, setAll] = useState(0)
    const [average, setAverage] = useState(0)
    const [positive, setPositive] = useState(0)

    const handleGoodClick = () => {
        const updatedGood = good + 1
        setGood(updatedGood)
        const updatedAll = updatedGood + neutral + bad
        setAll(updatedAll)
        setAverage((updatedGood - bad) / updatedAll)
        setPositive(updatedGood / updatedAll * 100)
    }

    const handleNeutralClick = () => {
        const updatedNeutral = neutral + 1
        setNeutral(updatedNeutral)
        const updatedAll = good + updatedNeutral + bad
        setAll(updatedAll)
        setAverage((good - bad) / updatedAll)
        setPositive(good / updatedAll * 100)
    }

    const handleBadClick = () => {
        const updatedBad = bad + 1
        setBad(updatedBad)
        const updatedAll = good + neutral + updatedBad
        setAll(updatedAll)
        setAverage((good - updatedBad) / updatedAll)
        setPositive(good / updatedAll * 100)
    }

    return (
        <div>
            <h1>give feedback</h1>
            <Button onClick={handleGoodClick} text='good' />
            <Button onClick={handleNeutralClick} text='neutral' />
            <Button onClick={handleBadClick} text='bad' />
            <h1>statistics</h1>
            <Statistics good={good} neutral={neutral} bad={bad} all={all} average={average} positive={positive}/>
        </div>
    )
}

export default App