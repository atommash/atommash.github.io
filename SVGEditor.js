'use strict';
import Vector from './Vector.js';
import Dialog from './Dialog.js';
import Messages from './Messages.js';
import Properties from './Properties.js';
import {Drawline, Drawrect, Drawcircle, Drawtext, Drawsize, Drawpen} from './Drawobjects.js';

export default class SVGEditor {
	constructor() {
		this.svgeditor = get('#svgeditor');
		this.svg = get('#svg');
		this.objects = [];
		this.status = false;
		this.updata;//callback
		this.tool = 'none';

		this.styles = [
			'line-style-normal',
			'line-style-bold',
			'line-style-bold2',
			'line-style-dashed',
			'line-style-dotted',
			'line-style-doubleDotted'
		];
		this.currentStyle = 0;

		Object.assign(this, {
			width: 297,
			height: 210,
			scale: 3
		}, JSON.parse(localStorage.getItem('engine')));

		window.addEventListener('unload', () => {
			localStorage.setItem('engine', JSON.stringify({
				width: this.width,
				height: this.height,
				scale: this.scale
			}, null, ' '));
		});

		// init()
		this.msg = new Messages();
		this.msg.info(`Привет, ${this.constructor.name}!`);
		
		this.tools = new Dialog('', get('#toolbar'));//&#129518;

		this.rate(true);
		this.dragAndDrop();
		
		this.pts = new Properties(this);

		this.svg.addEventListener('mousedown', (e) => {
			switch(e.button) {
				case 0: // mouse left
					//console.log(`mouse wheell click`);
					this.mousedownLeft(e);
				break;

				case 1: // mouse wheell click
					//console.log(`mouse wheell click`);
				break;

				case 2: // mouse right
					//console.log(`mouse right`);
				break;

				default: console.log(`Вы нажали кнопку мыши: #${e.button}`);
			}
		});

		document.addEventListener('keydown', (e) => {
			switch(e.keyCode) {
				case 27: // ESC
					this.setTool('none');

					this.msg.info(`Отмена`);

					this.svg.querySelectorAll('.active').forEach((item) => {
						item.classList.toggle('active');
					});
				break;

				case 46: // DELETE
					this.svg.querySelectorAll('.active').forEach((item) => {
						svg.removeChild(item);
					});
				break;

				case 119: // F8
					this.rate(true);
				break;

				default:
					console.log(`Вы нажали кнопку на клавиатуре: ${e.keyCode}`);
			}


			//console.log(`keydown`, e.keyCode);
			//e.preventDefault();
		});

		document.addEventListener('wheel', (e) => {
			if(this.tool == 'none') {
				if(e.deltaY > 0 && this.scale > 1) {
					this.scale -=  0.1;
				} else if (e.deltaY < 0 && this.scale < 5) {
					this.scale += 0.1;
				}
				console.log(`Масштаб: ${this.scale.toFixed(1)}`);
				this.rate();
			}
		});

		document.addEventListener('contextmenu', (e) => {
			e.preventDefault();
		});
	}

	mousedownLeft(e) {
			if(this.tool !== 'none') {
				if(!this.status) {
					let last = this.switchTool();

					if(last !== false) {
						last.create(e);
						this.objects.push(last);

						this.updata = (e) => last.updata(e);
						this.status = true;
						this.svg.addEventListener('mousemove', this.updata);
					}

				} else {
					this.status = false;
					this.svg.removeEventListener('mousemove', this.updata);
				}
			} else {
				if(!this.status) {
					for(let n=0; n<this.objects.length; ++n) {
						if(this.objects[n].active(e)) {
							this.objects[n].toggle();
						}

						if(this.objects[n].contains()) {
							for(let i=0; i<this.objects[n].points.length; ++i) {
								if(this.objects[n].points[i].check(this.getXY(e))) {
									this.updata = (e) => this.objects[n].updata(e, i);
									this.status = true;
									this.svg.addEventListener('mousemove', this.updata);
									break;
								}
							}
						}

						if(this.status) break;
					}

				} else {
					this.status = false;
					this.svg.removeEventListener('mousemove', this.updata);
				}
			}
	}

	switchTool() {
		switch(this.tool) {
			case 'line': return new Drawline(this);
			case 'rect': return new Drawrect(this);
			case 'circle': return new Drawcircle(this);
			case 'text': return new Drawtext(this);
			case 'size': return new Drawsize(this);
			case 'pen': return new Drawpen(this);
			default: console.log(`Не найден инструмент: ${this.tool}`);
		}
		return false;
	}

	setTool(name) {
		this.tool = name;
	}

	getStyle() {
		return this.styles[this.currentStyle];
	}

	getXY(e) {
		let rect = this.svg.getBoundingClientRect();
		return new Vector(
			Math.ceil((e.pageX - rect.x) / this.scale),
			Math.ceil((e.pageY - rect.y) / this.scale)
		);
	}

	dragAndDrop() {
		let mouseOffset;
		let listener = (e) => {
			this.svgeditor.style.left = (e.pageX - mouseOffset.x) + 'px';
			this.svgeditor.style.top = (e.pageY - mouseOffset.y) + 'px';
		}

		let remove = (e) => {
			this.svgeditor.classList.remove('move');
			this.svgeditor.removeEventListener('mousemove', listener);
		}

		this.svgeditor.addEventListener('mousedown', (e) => {
			if(e.button == 2 && this.tool == 'none') {
				mouseOffset = {
					x: e.pageX - this.svgeditor.offsetLeft,
					y: e.pageY - this.svgeditor.offsetTop
				}

				this.svgeditor.classList.add('move');
				this.svgeditor.addEventListener('mousemove', listener);
			}
		});

		this.svgeditor.addEventListener('mouseup', remove);
		window.addEventListener('blur', remove);
	}

	rate(center = false) {
		let rect = this.svg.getBoundingClientRect(),
			w = Math.ceil(this.width * this.scale),
			h = Math.ceil(this.height * this.scale);

		setNS(this.svg, 'width', w);
		setNS(this.svg, 'height', h);

		if(center) {
			this.svgeditor.style.left = (window.innerWidth-w)/2+'px';
			this.svgeditor.style.top = (window.innerHeight-h)/2+'px';
		} else {
			this.svgeditor.style.left = rect.x+(rect.width-w)/2+'px';
			this.svgeditor.style.top = rect.y+(rect.height-h)/2+'px';
		}
	}
}