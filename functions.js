const keyframes = {
	'.fa-sun': {
		'rotate': { 0: 0, '100%': 180 },
		'opacity': { 0: 0, '20%': 1, '80%': 1, '100%': 0 }
	},
	
	'.fa-cloud': {
		'translateX': { 0: -150, '50%': -150, '85%': 0 },
		'opacity': { 0: 0, '50%': 0, '75%': 1 }
	}
};

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
		
		for (const selector in absoluteKeyframes) {
			animations[selector] = animations[selector] || {};
			
			for (const prop in absoluteKeyframes[selector]) {
				const fromScroll = getBiggestOfSmallerThan(Object.keys(absoluteKeyframes[selector][prop]), window.scrollY);
				const toScroll = getSmallestOfBiggerThan(Object.keys(absoluteKeyframes[selector][prop]), window.scrollY);
				
				const fromValue = absoluteKeyframes[selector][prop][fromScroll];
				const toValue = absoluteKeyframes[selector][prop][toScroll];
				
				let value = fromValue;
				
				if (fromValue !== toValue) {
					const scrollProgress = (window.scrollY - fromScroll) / (toScroll - fromScroll);
					
					value = (toValue - fromValue) * scrollProgress + fromValue;
				}
				
				switch (prop) {
					case 'translateX':
					case 'translateY':
						animations[selector].transform = animations[selector].transform || [];
						animations[selector].transform.push(`${prop}(${value}%)`);
						break;
					case 'rotate':
						animations[selector].transform = animations[selector].transform || [];
						animations[selector].transform.push(`rotate(${value}deg)`);
						break;
					case 'opacity':
						animations[selector].opacity = (value).toFixed(2);
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
	
	document.body.style.height = Math.max(
		...Object.values(absoluteKeyframes).map( selector => Math.max(
			...Object.values(selector).map( prop => Math.max(
				...Object.keys(prop)
			))
		))
	) + window.innerHeight + 'px';
	
	window.dispatchEvent(new Event('scroll'));
}

function relativeToAbsolute(frames) {
	const absolute = {};
	
	for (const selector in frames) {
		absolute[selector] = absolute[selector] || {};
		
		for (const prop in frames[selector]) {
			absolute[selector][prop] = absolute[selector][prop] || {};
			
			for (const key in frames[selector][prop]) {
				if (key.toString().match(/%$/)) {
					const scroll = parseInt(key) * window.innerHeight * 0.01;
					absolute[selector][prop][scroll.toFixed(0)] = frames[selector][prop][key];
				} else {
					absolute[selector][prop][key] = frames[selector][prop][key];
				}
			}
		}
	}
	
	return absolute;
}

function getBiggestOfSmallerThan(arr, max) {
	return arr.reduce( (prev, curr) => curr <= max && Math.abs(curr - max) < Math.abs(prev - max) ? curr : prev);
}

function getSmallestOfBiggerThan(arr, min) {
	return arr.reduce( (prev, curr) => curr > min && Math.abs(curr - min) < Math.abs(prev - min) ? curr : prev );
}