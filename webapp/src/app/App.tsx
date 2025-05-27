import { useEffect, useRef, useState } from 'react'
import './App.scss'
import { getBuildConfig } from '../util/build'
import Renderer from './renderer/renderer';


function App() {

	const buildInfo = getBuildConfig();
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const renderer = useRef<Renderer>(null);

	useEffect(() => {
		if (canvasRef.current) {
			renderer.current = new Renderer(canvasRef.current, { dpi: 2 });
		}
	}, [])


	return (
		<div>
			<h1>Max Ward</h1>
			<p>({buildInfo.branch}:{buildInfo.buildId})-{buildInfo.buildDate}</p>
			<canvas id="canvas" ref={canvasRef} width={1024} height={1024} style={{ border: "1px solid black" }}></canvas>
		</div>
	)
}

export default App
