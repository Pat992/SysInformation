import React, { useState, useEffect } from 'react'
import classes from './ProgressBar.module.css'

const ProgressBar = React.memo(props => {
    return (
        < div className={classes.ProgressBar} >
            <div
                className={classes.Progress}
                style={{ width: `${props.current}%`, backgroundColor: props.current > 75 ? '#c91e1e' : props.current > 50 ? '#f5b942' : '#4CAF50' }}
            >
                <p>{!isNaN(props.current) ? `${props.current}${props.type}` : 'Please start Programm as Admin'}</p>
            </div>
        </div >
    )
})

export default ProgressBar