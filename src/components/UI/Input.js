import React, { useImperativeHandle, useRef } from 'react'

import classes from './Input.module.css'

const Input = React.forwardRef( (props, ref) => {
    const inputRef = useRef()

    useImperativeHandle(ref, () => {
        return {
            current: inputRef.current 
        }
    })

    return (
        <div className={classes.input}>
            <label htmlFor={props.input.id}>{props.label}</label>
            <input {...props.input} />
        </div>
    )
})

export default Input