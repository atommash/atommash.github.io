'use strict';

import Vector from './Vector.js';

class Drawobjects {
	constructor(engine) {
		console.log(`Создание: ${this.constructor.name}`);
		this.engine = engine;
		this.points = [];
	}

	create(e) {
		this.points.push(this.engine.getXY(e), this.engine.getXY(e));

		this.object = this.engine.svg.appendChild(smartNS('path', {
			'class': this.engine.getStyle()
		}));
	}

	active(e) {
		let target = e.explicitOriginalTarget || e.target;
		return target === this.object;
	}

	toggle() {
		this.object.classList.toggle('active');
	}

	contains() {
		return this.object.classList.contains('active');
	}
}

export class Drawline extends Drawobjects {
	updata(e,i=1) {
		this.points[i] = this.engine.getXY(e);

		let {x: x1, y: y1} = this.points[0],
			{x: x2, y: y2} = this.points[1];

		setsNS(this.object, {'d': `M${x1} ${y1} L${x2} ${y2}`});
	}

	active(e) {
		return Vector.straight(this.points[0], this.points[1], this.engine.getXY(e));
	}
}

export class Drawrect extends Drawobjects {
	updata(e,i=1) {
		this.points[i] = this.engine.getXY(e);

		let {x: x1, y: y1} = this.points[0],
			{x: x2, y: y2} = this.points[1];

		setsNS(this.object, {'d': `M${x1} ${y1} H${x2} V${y2}
			M${x1} ${y1} V${y2} H${x2}`});
	}
	
	active(e) {
		return Vector.rect(this.points[0], this.points[1], this.engine.getXY(e));
	}
}

export class Drawcircle extends Drawobjects {
	updata(e,i=1) {
		this.points[i] = this.engine.getXY(e);

		let {x: x1, y: y1} = this.points[0],
			{x: x2, y: y2} = this.points[1];

		let dx = x2 - x1,
			dy = y2 - y1,
			r = Math.floor(Math.sqrt(dx*dx + dy*dy));

		setsNS(this.object, {'d': `M${x1} ${y1}
			m -${r},0
			a${r},${r} 0 1,0  ${r*2},0 
			a${r},${r} 0 1,0 -${r*2},0`});
	}

	active(e) {
		return Vector.circles(this.points[0], this.points[1], this.engine.getXY(e));
	}
}

export class Drawtext extends Drawobjects {
	create(e) {
		this.points.push(this.engine.getXY(e));
		
		this.object = this.engine.svg.appendChild(smartNS('text', {
			'class': 'color-black'
		}));

		this.object.textContent = 'my text write';
	}
	
	updata(e,i=1) {
		let {x,y} = this.engine.getXY(e);
		
		setsNS(this.object, {x,y});
	}
}

export class Drawsize extends Drawobjects {
	create(e) {
		this.points.push(this.engine.getXY(e));
		this.points.push(this.engine.getXY(e));

		this.object = this.engine.svg.appendChild(smartNS('path', {
			'class': this.engine.getStyle(),
			'marker-start': 'url(#arrow-start)',
			'marker-end': 'url(#arrow-end)',
		}));
	}
	
	updata(e,i=1) {
		this.points[i] = this.engine.getXY(e);

		let {x: x1, y: y1} = this.points[0],
			{x: x2, y: y2} = this.points[1];

		setsNS(this.object, {'d': `M${x1} ${y1} L${x2} ${y2}`});
	}
}

export class Drawpen extends Drawobjects {
	constructor(engine) {
		super(engine);
		this.markers = [];
		this.subline = [];
	}

	create(e) {
		this.points.push(
			this.engine.getXY(e), this.engine.getXY(e),
			this.engine.getXY(e), this.engine.getXY(e)
		);

		this.object = this.engine.svg.appendChild(smartNS('path', {
			'class': this.engine.getStyle()
		}));
	}

	toggle() {
		if(this.markers.length > 0) {
			this.markers.forEach(e => e.parentNode.removeChild(e));
			this.markers = [];

			this.subline.forEach(e => e.parentNode.removeChild(e));
			this.subline = [];
		} else {
			this.points.forEach(point => {
				this.markers.push(this.engine.svg.appendChild(smartNS('circle', {
					'cx': point.x,
					'cy': point.y,
					'r': 1, 'fill': 'none', 'stroke': '#07f'
				})));
			});

			let {x: x1, y: y1} = this.points[0],
				{x: x2, y: y2} = this.points[1],
				{x: x3, y: y3} = this.points[2],
				{x: x4, y: y4} = this.points[3];

			this.subline.push(this.engine.svg.appendChild(smartNS('path', {
				'd': `M${x1} ${y1} L${x2} ${y2}`,
				'fill': 'none', 'stroke': '#07f'
			})));

			this.subline.push(this.engine.svg.appendChild(smartNS('path', {
				'd': `M${x3} ${y3} L${x4} ${y4}`,
				'fill': 'none', 'stroke': '#07f'
			})));
		}
	}

	contains() {
		return this.markers.length > 0;
	}

	updata(e,i=3) {
		this.points[i] = this.engine.getXY(e);

		let {x: x1, y: y1} = this.points[0],
			{x: x2, y: y2} = this.points[1],
			{x: x3, y: y3} = this.points[2],
			{x: x4, y: y4} = this.points[3];

		if(this.markers.length > 0) this.points.forEach((point,i) => {
			setsNS(this.markers[i], {'cx': point.x, 'cy': point.y});
		});
		
		if(this.subline.length > 0) {
			setsNS(this.subline[0], {'d': `M${x1} ${y1} L${x2} ${y2}`});
			setsNS(this.subline[1], {'d': `M${x3} ${y3} L${x4} ${y4}`});
		}

		setsNS(this.object, {'d': `M${x1} ${y1} C${x2} ${y2}, ${x3} ${y3}, ${x4} ${y4}`});
	}
}

