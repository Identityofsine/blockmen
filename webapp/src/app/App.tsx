import { useEffect, useRef, useState } from 'react'
import './App.scss'
import { getBuildConfig } from '../util/build'
import Renderer from './renderer/renderer';
import { WebSocketInstance } from './websocket/websocket';
import { DemoWorld } from './renderer/scene/views/DemoWorld';


function App() {

	const buildInfo = getBuildConfig();
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const renderer = useRef<Renderer>(null);

	useEffect(() => {
		WebSocketInstance.getInstance().connect();
		WebSocketInstance.getInstance().addEventListener('open', () => {
			console.log("WebSocket opened");
			WebSocketInstance.getInstance().send({ type: "ping" });
		});
		if (canvasRef.current) {
			renderer.current = new Renderer(canvasRef.current, { dpi: 2 });
			renderer.current.scenes.loadScene(new DemoWorld())
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
