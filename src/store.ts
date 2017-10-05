import { observable } from 'mobx';


export class Store {
  @observable backgroundColor = '#000000';
  @observable linesOfSymmetry = 3;
}


export default new Store();