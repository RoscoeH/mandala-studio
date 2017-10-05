import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Component } from 'react';
import { observer } from 'mobx-react';
import * as tinycolor from 'tinycolor2';

import { CANVAS_SIZE, CANVAS_PADDING } from './constants';
import store from './store';
import { Poly, Point } from './store';

@observer
class App extends Component {
	private canvas;
	private canvasNode;
	private canvasPoint;
	
	componentDidMount() {
		document.addEventListener('mouseup', () => {
			console.log('up');
			store.finishShape();
		});

		this.canvasNode = ReactDOM.findDOMNode(this.canvas);
		this.canvasPoint = this.canvasNode.createSVGPoint();
		console.log(this.canvasPoint);
	}
	
	handleCanvasOnMouseDown() {
		console.log('down');
		store.startShape();
	}
	
	handleCanvasOnMouseMove = ({clientX, clientY}): void => {
		if (store.drawing) {
			this.canvasPoint.x = clientX;
			this.canvasPoint.y = clientY;
			const { x, y } = this.canvasPoint.matrixTransform(this.canvasNode.getScreenCTM().inverse());
			store.addPoint({ x, y });
		}
	}

	render() {
		const guidelineColor = tinycolor(store.backgroundColor).isLight() ? '#000' : '#fff';

		return (
			<div
				className="app"
				style={{ backgroundColor: store.backgroundColor }}>
				<svg
					className="canvas"
					ref={canvas => this.canvas = canvas}
					width={CANVAS_SIZE}
					height={CANVAS_SIZE}
					viewBox={`0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}`}
					onMouseDown={this.handleCanvasOnMouseDown}
					onMouseMove={this.handleCanvasOnMouseMove}
				>
					<defs>
						<g id="mirrored-shapes">
							<g id="shapes">
								{store.shapes.map((shape: Poly) => {
									return (
										<polyline
											points={shape.points.map((point: Point) => `${point.x},${point.y}`).join(' ')}
											stroke={'#fff'}
											fill="none"
										/>
									)
								})}
							</g>
							<use
								href="#shapes"
								transform={`matrix(-1, 0, 0, 1, ${CANVAS_SIZE}, 0)`}
							/>
						</g>

						<line
							id="guideline"
							x1={CANVAS_SIZE / 2}
							x2={CANVAS_SIZE / 2}
							y1={CANVAS_PADDING}
							y2={CANVAS_SIZE - CANVAS_PADDING}
							stroke={guidelineColor}
						/>

						<circle
							id="guidecircle"
							cx={CANVAS_SIZE / 2}
							cy={CANVAS_SIZE / 2}
							r={CANVAS_SIZE / 2 - CANVAS_PADDING}
							stroke={guidelineColor}
							fill="rgba(0, 0, 0, 0)"
						/>
					</defs>

					<rect
						x={0}
						y={0}
						width={CANVAS_SIZE}
						height={CANVAS_SIZE}
						fill={store.backgroundColor}
					/>

					{range(store.linesOfSymmetry, (index) => {
						return (
							<use
								key={index}
								href="#guideline"
								transform={rotate(360 / store.linesOfSymmetry * index)}
							/>
						)
					})}
					<use href="#guidecircle" />


					{range(store.linesOfSymmetry, (index) => {
						return (
							<use
								key={index}
								href="#mirrored-shapes" 
								transform={rotate(360 / store.linesOfSymmetry * index)}
							/>
						);
					})}
				</svg>
			</div>
		);
	}
}

export default App;


function range(n: number, fn: (number) => any): any[] {
	return Array.from(Array(n), (_, i: number) => fn(i));
}


function rotate(degrees: number): string {
	return `rotate(${degrees}, ${CANVAS_SIZE / 2}, ${CANVAS_SIZE / 2})`;
}