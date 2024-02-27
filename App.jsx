import React from "react"
import { nanoid } from 'nanoid'
import Question from "./Question"
import {decode} from "html-entities"

export default function App(){
    const [showStart, setShowStart] = React.useState(false)
    const [questions, SetQuestions] = React.useState([])
    const [questionsArray, setQuestionsArray] = React.useState()
    const [rightAnswers, setRightAnswers] = React.useState(0)
    const [showAnswers, setShowAnswers] = React.useState(false)
    const [playNumbers, setPlayNumbers] = React.useState(0)
    
    React.useEffect(() => {
        fetch("https://opentdb.com/api.php?amount=5")
            .then(res => res.json())
            .then(data => {
                SetQuestions(data)
            })
        console.log("Hey")
    }, [playNumbers])
    
    const shuffle = array => {
                for(let i = array.length - 1; i>0; i--){
                    const j = Math.floor(Math.random()*(i + 1))
                    const temp = array[i]
                    array[i] = array[j]
                    array[j] = temp
                }
                return array
            }
    
    function showContent(){
        setShowStart(prevValue => !prevValue)
        setQuestionsArray(questions.results.map(question => {
            const answersArray = []
            answersArray.push({
                answer: decode(question.correct_answer),
                isCorrect: true,
                isChecked: false,
                id: nanoid(),
                isRight: ""
            })
            for(let incorrect_answer of question.incorrect_answers){
                answersArray.push({
                    answer: decode(incorrect_answer),
                    isCorrect: false,
                    isChecked: false,
                    id: nanoid(),
                    isRight: ""
                })
            }
            const shufledArray = shuffle(answersArray)
            return <Question 
                key={nanoid()}
                id={nanoid()}
                question={decode(question.question)}
                answers={shufledArray}
                checked={(event) => checkedUnchecked(event, shufledArray)}
                showAnswers={false}
            />
        }))
    }
    
    function checkedUnchecked(event, array, questionsArray){
        setQuestionsArray(prevQuestionArray => {
            return prevQuestionArray.map(oldQuestion => {
                if(oldQuestion.props.id === event.target.parentElement.id){
                    const newAnswers =  oldQuestion.props.answers.map(answer => {
                        return answer.id === event.target.id ? {
                            ...answer,
                            isChecked: !answer.isChecked
                        } : {
                            ...answer,
                            isChecked: false
                        }
                    })
                    return {
                        ...oldQuestion,
                        props: {
                            ...oldQuestion.props,
                            answers: newAnswers
                        }
                    }
                }
                return <Question 
                    key={oldQuestion.key}
                    id={oldQuestion.props.id}
                    question={oldQuestion.props.question}
                    answers={oldQuestion.props.answers}
                    checked={oldQuestion.props.checked}
                    showAnswers={false}
                />  
            })
        })
    }
    
    function checkAnswers(){
        setShowAnswers(prevValue => !prevValue)
        setQuestionsArray(prevQuestionArray => {
            return prevQuestionArray.map(oldQuestion => {
                const checkedAnswers = oldQuestion.props.answers.map(answer => {
                    if(answer.isChecked){
                        if(answer.isCorrect){
                            answer.isRight = "right"
                            setRightAnswers(prevRightAnswers => prevRightAnswers + 1)
                        } else {
                            answer.isRight = "false"
                        } 
                    } else {
                        if(answer.isCorrect){
                            answer.isRight = "right"
                        } else {
                            answer.isRight = ""   
                        }
                    }
                    return answer
                })
                return <Question 
                    key={oldQuestion.key}
                    id={oldQuestion.props.id}
                    question={oldQuestion.props.question}
                    answers={oldQuestion.props.answers}
                    checked={oldQuestion.props.checked}
                    showAnswers={!showAnswers}
                />  
            })
        })
    }
    
    function playAgain(){
        setPlayNumbers(previousValue => previousValue + 1)
        setShowStart(false)
        setShowAnswers(false)
        setRightAnswers(0)
    }
    if(!showStart){
        return(
            <main>
                <div className="start">
                    <h2>Quizzical</h2>
                    <h3>Test your knowledge</h3>
                    <button onClick={showContent}>Start Quiz</button>
                </div>
            </main>
        )
    } else {
         return (
             <main className="content">
                {questionsArray}
                <div className="footer">
                    {showAnswers && <p>You scored {rightAnswers}/5 correct answers</p>} 
                    <button onClick={showAnswers ? playAgain : checkAnswers} className="footer-btn">
                        {showAnswers ? "Play again" : "Check answers"}
                    </button>
                </div>
            </main>
         )
    }
}

