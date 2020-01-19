


<div class="editor" contenteditable="true"></div>


			// CTRL=17;
			if(this.keys.indexOf(17) !== -1) {

				//R=82
				if(this.keys.indexOf(83) !== -1) {
					document.location.reload(true);
				}

				// S=83
				if(this.keys.indexOf(83) !== -1) {
					this.save();
				}

				// Z=90
				if(this.keys.indexOf(90) !== -1) {
					this.msg.info('Отмена.');
					//this.drawObjects.pop(); //splice(-1, 1);
				}
			}



	startEventKeys() {
		this.keys = [];

		document.addEventListener('keydown', (e) => {
			if(!this.keys.includes(e.keyCode)) {
				this.keys.push(e.keyCode);
			}




		});

		document.addEventListener('keyup', (e) => {
			this.keys.splice(this.keys.indexOf(e.keyCode), 1);
			//console.log(`keyup`, e.keyCode, e.which);
		});
	}



function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

function describeArc(x, y, radius, startAngle, endAngle){
    var start = polarToCartesian(x, y, radius, endAngle);
    var end = polarToCartesian(x, y, radius, startAngle);
    var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    var d = [
        "M", start.x, start.y, 
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");
    return d;       
}
