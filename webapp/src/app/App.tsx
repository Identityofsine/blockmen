import { useState } from 'react'
import './App.scss'
import { getBuildConfig } from '../util/build'


function App() {

	const buildInfo = getBuildConfig();

	return (
		<div>
			<h1>Max Ward</h1>
			<p>({buildInfo.branch}:{buildInfo.buildId})-{buildInfo.buildDate}</p>
		</div>
	)
}

export default App
