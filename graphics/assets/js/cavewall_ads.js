const ads = nodecg.Replicant('assets:cavewall_ads');

ads.on('change', value => {
	setupAds(value);
});

const responsiveSlider = function () {
	const slider = document.getElementById('ads_loop');
	let sliderWidth = slider.offsetWidth;
	const slideList = document.getElementById('ads_list');
	let count = 1;
	const items = slideList.querySelectorAll('li').length;

	window.addEventListener('resize', () => {
		sliderWidth = slider.offsetWidth;
	});

	const nextSlide = function () {
		if (count < items) {
			slideList.style.left = '-' + count * sliderWidth + 'px';
			count++;
		} else if (count = items) {
			slideList.style.left = '0px';
			count = 1;
		}
	};

	setInterval(() => {
		nextSlide();
	}, 3500);
};

function setupAds(value) {
	try {
		if (typeof value !== 'undefined') {
			$('#ads_list').html('');
			value.forEach(ad => {
				console.log(`Adding ad ${ad.base}`);
				$('#ads_list').append(`<li class="ads_item"><img class="ads" src="${ad.url}"></li>`);
			});
		} else {
			throw 'no ads';
		}
	} catch (e) {
		console.log(e);
	} finally {
		responsiveSlider();
	}
}
