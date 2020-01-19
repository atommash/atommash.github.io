'use strict';
(function() {
	window.addEventListener('DOMContentLoaded', () => {
		let canvas = document.body.appendChild(document.createElement('canvas'));
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		canvas.style.position = 'absolute';
		canvas.style.top = '0px';
		canvas.style.left = '0px';
		canvas.style.zIndex = '-999';
		let ctx = canvas.getContext('2d');
		let stars = [];

		for(let i = 0; i < 10; ++i) {
			stars.push({
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height,
				dx: Math.random() - 0.5,
				dy: Math.random() - 0.5,
				radius: Math.random() * 50 + 20,
				speed: 0.2,
				opacity: Math.random() + 0.1
			});
		}

		let draw = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			stars.forEach((s) => {
				s.x += s.dx * s.speed;
				s.y += s.dy * s.speed;
				if(s.x > canvas.width || s.x < 0) s.dx = -s.dx;
				if(s.y > canvas.height || s.y < 0) s.dy = -s.dy;
				ctx.fillStyle = `rgba(255,255,255,${s.opacity})`;
				ctx.beginPath();
				ctx.arc(s.x, s.y, s.radius, 0, 2*Math.PI);
				ctx.closePath();
				ctx.fill();
			});
			requestAnimationFrame(draw);
		};
		draw();
	});
})();