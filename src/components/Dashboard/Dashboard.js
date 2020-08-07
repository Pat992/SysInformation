import React, { useState, useEffect } from 'react'
import { ipcRenderer } from 'electron'
import ProgressBar from '../UI/ProgressBar/ProgressBar'

const Dashboard = React.memo(props => {

    const [dynamicCPU, setDynamicCPU] = useState(null)
    const [dynamicGPU, setDynamicGPU] = useState(null)
    const [dynamicMem, setDynamicMem] = useState(null)

    useEffect(() => {
        // get new informations every two seconds
        const interval = setInterval(() => {
            ipcRenderer.send('infos:getDynamicDashboard')
            ipcRenderer.on('infos:receiveDynamicDashboard', (sender, data) => {
                setDynamicCPU(data.cpu)
                setDynamicGPU(data.gpu)
                setDynamicMem(data.mem)
            })
        }, 1000)
        // clear interval on unmount
        return () => {
            clearInterval(interval)
        }
    }, [])

    return (
        <div>
            <h3>{props.staticGPU ? props.staticGPU[0] : 'N/A'}</h3>
            <p>Usage:</p>
            {props.staticGPU && dynamicGPU ?
                <ProgressBar
                    current={parseInt(dynamicGPU[0])}
                    type={'%'}
                />
                : null
            }
            <p>Temperature:</p>
            {props.staticGPU && dynamicGPU ?
                <ProgressBar
                    current={parseInt(dynamicGPU[1])}
                    type={'°C'}
                />
                : null
            }
            <hr />
            <h3>{props.staticCPU ? props.staticCPU[0] + ' ' : 'N/A'}</h3>
            <p>Usage:</p>
            {props.staticCPU && dynamicCPU ?
                <ProgressBar
                    current={parseInt(dynamicCPU[0])}
                    type={'%'}
                />
                : null
            }
            <hr />
            <h3>Memory {props.staticMem ? (parseInt(props.staticMem[0] / 1000000000)) : ''} GB</h3>
            <p>Usage:</p>
            {props.staticMem && dynamicMem ?
                <ProgressBar
                    current={parseInt(100 / (props.staticMem[0] / 1000000000) * (props.staticMem[0] / 1000000000) - (dynamicMem / 1000000)) }
                    type={'%'}
                />
                : null
            }
        </div>
    )
})

export default Dashboard
