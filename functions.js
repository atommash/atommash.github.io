'use strict';

const get = (e) => document.querySelector(e),
	setNS = (e,k,v) => e.setAttributeNS(null, k, v),
	getNS = (e,k) => e.getAttributeNS(null, k),
	setsNS = (el,r) => {
		if(r) Object.keys(r).forEach(k => setNS(el,k,r[k]));
		return el;
	},
	smartNS = (e,r) => setsNS(document.createElementNS('http://www.w3.org/2000/svg',e),r);

const smart = (e,r) => {
		let el=document.createElement(e);
		if(r) Object.keys(r).forEach(k => el[k]=r[k]);
		return el;
	};

const createUL = (r,o) => {
		let el=smart('ul',o);
		r.forEach((k) => el.appendChild(smart('li')).appendChild(k));
		return el;
	};

const remove = (e,t=2000) => setTimeout(() => e.parentNode.removeChild(e),t);