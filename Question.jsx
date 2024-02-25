import React from "react"
import { nanoid } from 'nanoid'

export default function Question(props){
    const answersElement = props.answers.map(answer => {
        const styles = props.showAnswers ? {
            backgroundColor: answer.isRight === "right" ? "#94D7A2"
            : (
                answer.isRight === "false" ? "#F8BCBC"
                : ""
            ),
            color: "black",
            opacity: answer.isRight === "right" ? "1" : "0.3",
            border: answer.isRight === "right" ? "none" : ""
        } : {
            
        }
        return (
            <span 
                key={nanoid()} 
                id={answer.id}
                className={answer.isChecked ? "checked" : "unchecked"} 
                style={styles}
            >
                {answer.answer}
            </span>
        )
    })
    return (
        <div className="question">
            <p className="question-title">{props.question}</p>
            <div className="answers" onClick={props.checked} id={props.id}>
                {answersElement}
            </div>
        </div>
    )
}