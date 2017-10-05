import * as React from 'react';
import { Component } from 'react';

import { CANVAS_SIZE } from './constants';
import store from './store';


class App extends Component {
	render() {
		return (
			<div className="app">
				<svg
					className="canvas"
					width={CANVAS_SIZE}
					height={CANVAS_SIZE}
					viewBox={`0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}`}
				>
					<defs>
						<g id="mirrored-shapes">
							<g id="shapes">
								<rect
									x={150}
									y={150}
									width={50}
									height={50}
									fill="#fff"
								/>
								<circle cx={120} cy={160} r={20} fill="#ff0000" />
							</g>
							<use
								href="#shapes"
								transform={`matrix(-1, 0, 0, 1, ${CANVAS_SIZE}, 0)`}
							/>
						</g>
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
								href="#mirrored-shapes" 
								transform={`rotate(${360 / store.linesOfSymmetry * index}, ${CANVAS_SIZE / 2}, ${CANVAS_SIZE / 2})`}
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