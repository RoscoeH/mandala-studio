import { GUI } from 'dat.gui';
import store from './store';


const gui = new GUI({ autoPlace: false});
gui.addColor(store, 'backgroundColor');
gui.add(store, 'linesOfSymmetry')
  .min(1)
  .step(1)
  .max(16);


// Place the controls
const datAnchor = document.getElementById('dat')
while(datAnchor.firstChild) {
  datAnchor.removeChild(datAnchor.firstChild);
}
datAnchor.appendChild(gui.domElement);

