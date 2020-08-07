import React, { useState } from 'react'
import classes from './Slider.module.css'

const Slider = React.memo(props => {
    return (
        <div className={classes.Slider}>
            <input type="range" min="1" max="100" step="1" value={props.opacity} onChange={(e) => props.setOpacity(e.target.value)} className={classes.Slider} />
        </div>
    )
})

export default Slider