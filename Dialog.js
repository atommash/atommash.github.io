'use strict';

export default class Dialog {
	constructor(title, text, pos) {
		this.main = document.body.appendChild(smart('div', {className: 'dialog'}));
		this.divTitle = this.main.appendChild(smart('div', {className: 'dialog-title'}));
		this.divText = this.main.appendChild(smart('div', {className: 'dialog-text'}));
		this.textContent = this.divTitle.appendChild(smart('div', {innerHTML: title}));
		this.button = this.divTitle.appendChild(smart('div'));

		if(pos) {
			this.main.style.left = pos.x + 'px';
			this.main.style.top = pos.y + 'px';
		}

		if(typeof text === 'string') {
			this.divText.innerHTML = text;
		} else {
			this.divText.appendChild(text);
		}

		this.dragAndDrop();
	}

	addButtonClose(callback) {
		let buttonClose = this.button.appendChild(smart('a', {href: 'javascript:void(0);', innerHTML: ' &#10006; '}));

		buttonClose.addEventListener('click', (e) => {
			this.main.classList.toggle('hidden');
			if(callback !== undefined) callback();

			remove(this.main);
		});
	}

	dragAndDrop(button = 0) {
		let mouseOffset;

		let listener = (e) => {
			this.main.style.left = (e.pageX - mouseOffset.x) + 'px';
			this.main.style.top = (e.pageY - mouseOffset.y) + 'px';
		}

		let remove = (e) => {
			this.divTitle.classList.remove('move');
			this.divTitle.removeEventListener('mousemove', listener);
		}

		this.divTitle.addEventListener('mousedown', (e) => {
			if(e.button === button) {
				mouseOffset = {
					x: e.pageX - this.main.offsetLeft,
					y: e.pageY - this.main.offsetTop
				};

				this.divTitle.classList.add('move');
				this.divTitle.addEventListener('mousemove', listener);
			}
		});

		this.divTitle.addEventListener('mouseup', remove);
		window.addEventListener('blur', remove);
	}
}
