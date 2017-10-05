import { observable, computed } from 'mobx';


export interface Point {
  x: number;
  y: number;
}

export interface Poly {
  points: Point[];
}


export class Store {
  @observable backgroundColor = '#000000';
  @observable linesOfSymmetry = 3;
  @observable showGuidelines = true;
  @observable drawing = false;
  @observable shapes: Poly[] = [{ points: [] }];

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
    this.shapes.push({ points: [] });
    this.drawing = false;
  }
}


export default new Store();