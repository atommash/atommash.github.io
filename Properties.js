'use strict';
import Dialog from './Dialog.js';

export default class Properties {
	constructor(engine) {
		this.engine = engine;

		this.form = smart('form', {name: 'properties'});

		let rows = [];
		this.engine.styles.forEach((item) => {
			let svg = smartNS('svg', {width: '100', height: '10'}),
				path = svg.appendChild(smartNS('path', {'d': 'M2 5 H90', 'class': item}));
			rows.push(svg);
		});

		this.form.addEventListener('change', () => this.engine.currentStyle = this.get('select'));
		this.form.appendChild(this.input('select', rows));

		this.dialog = new Dialog('&#129518; Стили', this.form, {x: 30, y: 430});
	}

	get(name) {
		return parseFloat(document.forms['properties'][name].value, 10);
	}

	input(name, rows, prefix = 'pf_') {
		let ul = smart('ul');
		rows.forEach((item, i) => {
			let li = ul.appendChild(smart('li')),
				label = li.appendChild(smart('label', {htmlFor: prefix + i})),
				inp = li.appendChild(smart('input', {
					type: 'radio',
					name: name,
					id: prefix + i,
					value: i
				}));

				if(typeof item === 'object') label.appendChild(item);
		});
		return ul;
	}
}