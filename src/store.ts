import { observable, computed } from 'mobx';

export interface Point {
  x: number;
  y: number;
}

export interface Poly {
  points: Point[];
  color: string;
  weight: number;
}


export class Store {
  @observable mirror = false;
  @observable backgroundColor = '#000000';
  @observable penColor = '#ffffff';
  @observable penSize = 4;
  @observable linesOfSymmetry = 3;
  @observable showGuidelines = true;
  @observable drawing = false;
  @observable shapes: Poly[] = [];
  @observable history: Poly[][] = [ [] ];
  @observable historyIndex = 0;

  @computed
  get currentShape(): Poly {
    return this.shapes[this.shapes.length - 1];
  }

  @computed
  get currentShapes(): Poly[] {
    return this.history[this.historyIndex];
  }

  @computed
  get isCanvasFresh(): boolean {
    return this.shapes.length === 0;
  }

  startShape() {
    this.drawing = true;
    this.shapes.push({
      points: [],
      color: this.penColor,
      weight: this.penSize
    });
  }

  addPoint(point: Point) {
    this.currentShape.points.push(point);
  }

  finishShape() {
    this.saveHistory();

    this.shapes.push({
      points: [],
      color: this.penColor,
      weight: this.penSize
    });
    this.drawing = false;
  }

  clear() {
    this.shapes = [{
      points: [],
      color: this.penColor,
      weight: this.penSize
    }];
  }

  saveHistory() {
    // If we have a future, remove it
    if (this.historyIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.historyIndex + 1);
    }
    
    // Save a snapshot
    this.history.push([ ...this.shapes ]);
    this.historyIndex++;
  }

  undo() {
    // If we have a past
    if (this.historyIndex > 0) {
      // Rewind a step
      this.historyIndex--;
      this.shapes = [ ...this.history[this.historyIndex] ];
    }
  }

  redo() {
    // If we have a future
    if (this.historyIndex < this.history.length - 1) {
      // Go forward a step
      this.historyIndex++;
      this.shapes = [ ...this.history[this.historyIndex] ];
    }
  }
}


export default new Store();