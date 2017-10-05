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
  @observable shapes: Poly[] = [{
    points: [],
    color: this.penColor,
    weight: this.penSize
  }];

  @computed
  get currentShape(): Poly {
    return this.shapes[this.shapes.length - 1];
  }

  startShape() {
    this.drawing = true;
  }

  addPoint(point: Point) {
    this.currentShape.points.push(point);
  }

  finishShape() {
    this.shapes.push({
      points: [],
      color: this.penColor,
      weight: this.penSize
    });
    this.drawing = false;
  }
}


export default new Store();