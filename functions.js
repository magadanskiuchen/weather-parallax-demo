const keyframes = [
	{
		selector: '.fa-sun',
		start: 0,
		end: '100%',
		property: 'rotate',
		from: 0,
		to: 180
	},
	{
		selector: '.fa-sun',
		start: 0,
		end: '20%',
		property: 'opacity',
		from: 0,
		to: 1
	},
	{
		selector: '.fa-sun',
		start: '80%',
		end: '100%',
		property: 'opacity',
		from: 1,
		to: 0
	}
];

let absoluteKeyframes = {};

document.addEventListener('DOMContentLoaded', e => {
	init();
});

window.addEventListener('resize', e => {
	requestAnimationFrame(() => {
		init();
	});
});

window.addEventListener('scroll', e => {
	requestAnimationFrame(() => {
		const animations = {};
		
		for (frame of absoluteKeyframes) {
			animations[frame.selector] = animations[frame.selector] || {};
			
			if (window.scrollY >= frame.start && window.scrollY <= frame.end) {
				// const value = -(frame.to - frame.from)/2 * (Math.cos(Math.PI*window.scrollY/frame.end) - 1) + frame.from;
				
				const scrollProgress = (window.scrollY - frame.start) / (frame.end - frame.start);
				const value = (frame.to - frame.from) * scrollProgress + frame.from;
				
				switch (frame.property) {
					case 'rotate':
						animations[frame.selector].transform = animations[frame.selector].transform || [];
						animations[frame.selector].transform.push(`rotate(${value}deg)`);
						break;
					case 'opacity':
						animations[frame.selector].opacity = (value).toFixed(2);
						break;
				}
			}
		}
		
		for (const selector in animations) {
			const element = document.querySelector(selector);
			
			for (const property in animations[selector]) {
				element.style[property] = (typeof(animations[selector][property]) == 'object') ? animations[selector][property].join(' ') : animations[selector][property];
			}
		}
	});
});

function init() {
	absoluteKeyframes = relativeToAbsolute(keyframes);
	document.body.style.height = Math.max.apply(Math, absoluteKeyframes.map(object => object.end + window.innerHeight)) + 'px';
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