'use strict';

import SVGEditor from './SVGEditor.js';
import SVGDragover from './SVGDragover.js';

window.addEventListener('DOMContentLoaded', () => {
	window.engine = new SVGEditor();
	window.file = new SVGDragover(window.engine);
});