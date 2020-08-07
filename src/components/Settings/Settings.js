import React, { useState, useEffect } from 'react'
import Slider from '../UI//Slider/Slider'
import classes from './Settings.module.css'
import { parseBooleans } from 'xml2js/lib/processors'

const Settings = (props => {

    const setSettings = (opacity, alwaysOnTop, currentScreen) => {
        props.updateSettings({ settings: { opacity: (opacity / 100), alwaysOnTop: alwaysOnTop, screen: currentScreen }, windows: props.amountScreens })
    }
    console.log(props.getCurrentWindow)
    const options = [];
    for (let i = 0; i < props.amountScreens; ++i) {
        options.push(<option key={`opt${i}`} value={i}>{i + 1}</option>)
    }

    const onSubmitHandler = (e) => {
        e.preventDefault()
        props.saveSettings()
    }
    return (
        <form className={classes.Settings}>
            <p><b>Window always on Top</b></p>
            <div className={classes.RadioForm}>
                <label htmlFor='onTopTrue'>True
                <input className={classes.RadioBtn} type='radio' value={true} name='setAlwaysOnTop' id='onTopTrue' checked={props.getAlwaysOnTop} onChange={(e) => setSettings(props.getOpacity, parseBooleans(e.target.value), props.getCurrentWindow)} />
                </label>
                <label htmlFor='onTopFalse'>False
                <input className={classes.RadioBtn} type='radio' value={false} name='setAlwaysOnTop' id='onTopFalse' checked={!props.getAlwaysOnTop} onChange={(e) => setSettings(props.getOpacity, parseBooleans(e.target.value), props.getCurrentWindow)} />
                </label>
            </div>
            <p><b>Screen</b></p>
            <select value={props.getCurrentWindow} onChange={e => setSettings(props.getOpacity, props.getAlwaysOnTop, e.target.value)}>
                {options}
            </select>
            <p><b>Window-Opacity</b></p>
            <Slider opacity={props.getOpacity} setOpacity={(opacity) => setSettings(opacity, props.getAlwaysOnTop, props.getCurrentWindow)} />
            <button type='submit' onClick={onSubmitHandler}>Submit</button>
        </form>
    )
})

export default Settings
