'use strict';

import Dialog from './Dialog.js';
import Converter from './Converter.js';

export default class SVGDragover {
	constructor(engine) {
		this.engine = engine;

		this.engine.msg.info(`Привет, ${this.constructor.name}!`);

		this.engine.svg.addEventListener('dragover', (e) => {
			e.preventDefault();
			this.engine.svg.classList.add('svgDragover');
		});

		this.engine.svg.addEventListener('dragleave', (e) => {
			e.preventDefault();
			this.engine.svg.classList.remove('svgDragover');
		});

		this.engine.svg.addEventListener('drop', (e) => {
			e.preventDefault();
			this.engine.svg.classList.remove('svgDragover');

			let file = e.dataTransfer.files[0];
			this.engine.msg.info(`Имя файла: ${file.name}`);
			this.engine.msg.info(`Размер файла: ${file.size}`);
			this.engine.msg.info(`Тип файла: ${file.type}`);

			if(file.size > 1024*1024) {
				this.engine.msg.error(`Превышен допустимый размер файла!`);
			} else {
				let reader = new FileReader();
				reader.readAsText(file, 'utf-8');
				reader.addEventListener('load', () => {
					console.log(reader.result);
				});
			}
		});
	}

	save() {
		let dataURL = Converter.generateSVG(this.engine.svg);
		let dataPNG = Converter.generatePNG(dataURL, {width: this.engine.width, height: this.engine.height});

		let div = smart('div');

		let hrefSVG = div.appendChild(smart('a', {
			textContent: 'Скачать SVG', download: 'draw0.svg', href: dataURL
		}));

		let hrefPNG = div.appendChild(smart('a', {
			textContent: 'Скачать PNG', download: 'draw0.png', href: dataPNG.toDataURL('image/png')
		}));

		let dialog = new Dialog('Сохранить как ...', div);
		dialog.addButtonClose();
	}
}
