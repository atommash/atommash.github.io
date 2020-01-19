'use strict';

export default class Messages {
	constructor() {
		this.main = document.body.appendChild(smart('div', {className: 'messages'}));
	}

	info(text) {
		this.show(text, 'info');
	}
	success() {
		this.show(text, 'success');
	}
	error() {
		this.show(text, 'error');
	}
	warring() {
		this.show(text, 'warring');
	}

	show(text, name, time = 2000) {
		let msg = this.main.appendChild(smart('div', {innerHTML: text, className: name}));

		remove(msg);
	}
}