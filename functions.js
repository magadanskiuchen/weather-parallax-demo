const keyframes = [
	{
		selector: '.fa-sun',
		start: 0,
		end: '150%',
		property: 'rotate',
		from: 0,
		to: 360
	}
];

let absoluteKeyframes = {};

document.addEventListener('DOMContentLoaded', e => {
	init();
	document.body.style.height = Math.max.apply(Math, absoluteKeyframes.map(object => object.end)) + 'px';
});

window.addEventListener('resize', e => {
	requestAnimationFrame(() => {
		init();
	});
});

window.addEventListener('scroll', e => {
	requestAnimationFrame(() => {
		for (frame of absoluteKeyframes) {
			const element = document.querySelector(frame.selector);
			
			if (frame.start < window.scrollY && frame.end > window.scrollY) {
				const scrollProgress = (window.scrollY - frame.start) / (frame.end - window.scrollY);
				
				switch (frame.property) {
					case 'rotate':
						element.style.transform = `rotate(${parseInt(frame.to * scrollProgress)}deg)`;
						break;
				}
			}
		}
	});
});

function init() {
	absoluteKeyframes = relativeToAbsolute(keyframes);
}

function relativeToAbsolute(frames) {
	const absolute = [];
	
	for (const i in frames) {
		let obj = {};
		
		for (const j in frames[i]) {
			if (frames[i][j].toString().match(/%$/)) {
				obj[j] = parseInt(frames[i][j]) * window.innerHeight * 0.01;
			} else {
				obj[j] = frames[i][j];
			}
		}
		
		absolute.push(obj);
	}
	
	return absolute;
}