'use strict';

// Формулы векторов
export default class Vector {
	constructor(x,y) {
		this.x = x;
		this.y = y;
	}

	// Длина вектора или модуль вектора.
	// Или гиппотенуза!
	getLength() {
		let {x,y} = this;
		return Math.sqrt(x*x + y*y);
	}

	// Нормализация вектора.
	normalize() {
		let length = this.getLength();

		this.x /= length;
		this.y /= length;
	}

	// Координаты произведения векторов на число.
	product(c) {
		this.x *= c;
		this.y *= c;
	}

	/**
	 * Определения столкновений по пересечению проекций прямоугольников по осям X и Y.
	 * Длина и ширина которого являются габаритами исходного объекта.
	 * При пересечении функция возвращает true, иначе false.
	 */
	check(vector) {
		return (this.x+6 >= vector.x && this.x <= vector.x+6) &&
			(this.y+6 >= vector.y && this.y <= vector.y+6);
	}



	// Скалярное произведения векторов.
	static scalar(vectorA, vectorB) {
		let {x: x1, y: y1} = vectorA,
			{x: x2, y: y2} = vectorB;
		return x1*x2 + y1*y2;
	}

	// Координаты суммы векторов.
	static sum(vectorA, vectorB) {
		let {x: x1, y: y1} = vectorA,
			{x: x2, y: y2} = vectorB;
		return {x: x1+x2, y: y1+y2};
	}

	// Косинус угла между векторами А и В.
	static cosAB(vectorA, vectorB) {
		return Vector.scalar(vectorA, vectorB) / 
			(vectorA.getLength() * vectorB.getLength());
	}



	// Координаты вектора с началом в точке А и конце в точке В.
	static coords(vectorA, vectorB) {
		let {x: x1, y: y1} = vectorA,
			{x: x2, y: y2} = vectorB;
		return {x: x2-x1, y: y2-y1};
	}

	// Расстояние между точками А и В.
	static getAB(vectorA, vectorB) {
		let {x: dx, y: dy} = Vector.coords(vectorA, vectorB);
		return new Vector(dx, dy).getLength();
	}

	// Уравнение окружности с центров (x0, y0) и радиусом R
	// (x-x0)^2 + (y-y0)^2 = R^2
	// Math.sqrt((x-x0)**2 + (y-y0)**2);
	static circles(vectorA, vectorB, vector) {
		let result = Vector.getAB(vectorA, vector),
			R = Vector.getAB(vectorA, vectorB);
		return result > R*.9 && result < R*1.1;
	}

	// Уравнение прямой, проходящей через две точки.
	// (x-x1) / (x2-x1) = (y-y1) / (y2-y1)
	static straight(vectorA, vectorB, vector) {
		let {x: x1, y: y1} = vectorA,
			{x: x2, y: y2} = vectorB,
			{x, y} = vector;
		let result = (x-x1) * (y2-y1) - (x2-x1) * (y-y1);
		return result < 100 && result > -100;
	}

	static rect(vectorA, vectorB, vector) {
		let {x: x1, y: y1} = vectorA,
			{x: x2, y: y2} = vectorB,
			{x, y} = vector;

		let A = new Vector(x1, y1),
			B = new Vector(x2, y1),
			C = new Vector(x2, y2),
			D = new Vector(x1, y2);

		return Vector.straight(A, B, vector) ||
			Vector.straight(B, C, vector) ||
			Vector.straight(C, D, vector) ||
			Vector.straight(D, A, vector);
	}
}