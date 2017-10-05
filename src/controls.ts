import { GUI } from 'dat.gui';
import store from './store';
import exportCanvas from './export';

const gui = new GUI({ autoPlace: false});

const canvasFolder = gui.addFolder('Canvas');
canvasFolder.addColor(store, 'backgroundColor');
canvasFolder.add(store, 'linesOfSymmetry')
.min(1)
.step(1)
.max(16);
canvasFolder.add(store, 'mirror');
canvasFolder.add(store, 'showGuidelines');

const penFolder = gui.addFolder('Pen');
penFolder.addColor(store, 'penColor');
penFolder.add(store, 'penSize')
  .min(1)
  .step(1)
  .max(20);
// penFolder.open();

const editorFolder = gui.addFolder('Editor');
editorFolder.add(store, 'clear');
editorFolder.add(store, 'undo');
editorFolder.add(store, 'redo');
editorFolder.add({ export: exportCanvas }, 'export');
// editorFolder.open();

// Place the controls
const datAnchor = document.getElementById('dat')
while(datAnchor.firstChild) {
  datAnchor.removeChild(datAnchor.firstChild);
}
datAnchor.appendChild(gui.domElement);

