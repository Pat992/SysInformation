import React, { useState, useEffect } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import Navbar from './UI/Navbar/Navbar'
import Dashboard from './Dashboard/Dashboard'
import { ipcRenderer } from 'electron'

import classes from './App.module.css'
import ComputerInformation from './ComputerInformation/ComputerInformation'
import Settings from './Settings/Settings'

const App = () => {
	const [staticCPU, setStaticCPU] = useState(null)
	const [staticGPU, setStaticGPU] = useState(null)
	const [staticMem, setStaticMem] = useState(null)
	const [staticCom, setStaticCom] = useState(null)
	const [settingsObj, setSettingsObj] = useState({ settings: { opacity: 0, alwaysOnTop: false, screen: 0 }, windows: 0 })

	useEffect(() => {
		ipcRenderer.send('settings:get')
		ipcRenderer.on('settings:receive', (sender, data) => {
			setSettingsObj(data)
		})
	}, [])

	useEffect(() => {
		ipcRenderer.send('infos:getStatic')
		ipcRenderer.on('infos:receiveStatic', (sender, data) => {
			setStaticCPU(data.cpu)
			setStaticGPU(data.gpu)
			setStaticMem(data.mem)
			setStaticCom(data.comInfo)
		})
	}, [])

	const onSaveSettingsHandler = () => {
		ipcRenderer.send('settings:save', settingsObj)
	}
	return (
		<div className={classes.App}>
			<Navbar />
			<div className={classes.Body}>
				<Switch>
					<Route path='/' exact component={() =>
						<Dashboard
							staticCPU={staticCPU}
							staticGPU={staticGPU}
							staticMem={staticMem}
						/>}
					/>
					<Route path='/computerinformation' component={() => <ComputerInformation getStaticComInfos={staticCom} />}
					/>
					<Route path='/settings' component={() =>
						<Settings
							getOpacity={settingsObj.settings.opacity * 100}
							getAlwaysOnTop={settingsObj.settings.alwaysOnTop}
							getCurrentWindow={settingsObj.settings.screen}
							amountScreens={settingsObj.windows}
							updateSettings={setSettingsObj}
							saveSettings={onSaveSettingsHandler}
						/>}
					/>
					<Redirect from='*' to='/' />
				</Switch>
			</div>
		</div>
	)
}

export default App