import { useEffect, useRef } from "react";
import "./App.scss";
import { getBuildConfig } from "../util/build";
import Renderer from "./renderer/renderer";

function App() {
  const buildInfo = getBuildConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderer = useRef<Renderer>(null);

  useEffect(() => {
    if (canvasRef.current) {
      //could be static if only one canvas
      renderer.current = new Renderer(canvasRef.current);
    }
  }, [canvasRef.current]);

  return (
    <div>
      <h1>Max Ward</h1>
      <p>
        ({buildInfo.branch}:{buildInfo.buildId})-{buildInfo.buildDate}
      </p>
      <canvas ref={canvasRef} width={800} height={600} id="canvas"></canvas>
    </div>
  );
}

export default App;
