'use strict';

export default class Converter {
	// https://developer.mozilla.org/ru/docs/Web/API/WindowBase64/btoa
	static utf8_to_b64(str) {
		return window.btoa(unescape(encodeURIComponent(str)));
	}
	
	static b64_to_utf8(str) {
		return decodeURIComponent(escape(window.atob(str)));
	}

	static generateSVG(svg) {
		// <![CDATA[	]]>
		let serializer = new XMLSerializer(),
			source = serializer.serializeToString(svg);

		let	xmlSvg = '<?xml version="1.0" standalone="no"?>\r\n' + 
			'<?xml-stylesheet type="text/css" href="style.svg.css"?>\r\n' + source;

		return 'data:image/svg+xml;base64,' + Converter.utf8_to_b64(xmlSvg);
	}

	static generatePNG(dataURL, options) {
		let width = options.width || 297;
		let height = options.height || 210;

		let canvas = document.createElement('canvas');
		canvas.width = width;
		canvas.height = height;
		
		let ctx = canvas.getContext('2d');

		let image = new Image();
		image.src = dataURL;

		image.addEventListener('load', (e) => {
			ctx.drawImage(image, 0, 0);
		});	
		
		return canvas;
	}
}