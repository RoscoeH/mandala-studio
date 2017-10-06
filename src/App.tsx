import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Component } from 'react';
import { Helmet } from 'react-helmet';
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
		// Disable right click
		document.addEventListener('contextmenu', event => event.preventDefault());

		document.addEventListener('mouseup', () => {
			if (store.drawing) {
				store.finishShape();
			}
		});

		this.canvasNode = ReactDOM.findDOMNode(this.canvas);
		this.canvasPoint = this.canvasNode.createSVGPoint();
	}
	
	handleCanvasOnMouseDown({ button }) {
		console.log('down');
		store.startShape();
	}
	
	handleCanvasOnMouseMove = ({ touches, clientX, clientY }) => {
		console.log('move');
		if (touches && touches.length > 0) {
			clientX = touches[0].clientX;
			clientY = touches[0].clientY;
		}
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
				style={{ backgroundColor: store.backgroundColor }}
			>
				<Helmet>
					<meta name="theme-color" content={store.backgroundColor} />
				</Helmet>
				<div className="header">
					Rangoli Studio
				</div>
				<svg
					id="canvas"
					className="canvas"
					ref={canvas => this.canvas = canvas}
					width={CANVAS_SIZE}
					height={CANVAS_SIZE}
					viewBox={`0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}`}
					onMouseDown={this.handleCanvasOnMouseDown}
					onMouseMove={this.handleCanvasOnMouseMove}
					onTouchStart={this.handleCanvasOnMouseDown}
					onTouchMove={this.handleCanvasOnMouseMove}
				>
					<defs>
						<g id="mirrored-shapes">
							<g id="shapes">
								{store.shapes.map((shape: Poly, index: number) => {
									return (
										<polyline
											key={index}
											points={shape.points.map((point: Point) => `${point.x},${point.y}`).join(' ')}
											stroke={shape.color}
											strokeWidth={shape.weight}
											fill="none"
											strokeLinejoin="round"
										/>
									)
								})}
							</g>
							<use
								href="#shapes"
								transform={store.mirror
									? `matrix(-1, 0, 0, 1, ${CANVAS_SIZE}, 0)`
									: rotate(180 / store.linesOfSymmetry)
								}
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

					{store.showGuidelines && range(store.linesOfSymmetry, (index) => {
						return (
							<use
								key={index}
								href="#guideline"
								transform={rotate(180 / store.linesOfSymmetry * index)}
							/>
						)
					})}
					{store.showGuidelines && <use href="#guidecircle" />}


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
				<div className={`instructions ${store.isCanvasFresh ? '' : 'hide'}`}>
					&uarr;&nbsp;&nbsp;&nbsp;drag anywhere to draw&nbsp;&nbsp;&nbsp;&uarr;
				</div>
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