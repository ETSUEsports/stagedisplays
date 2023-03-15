'use strict';

module.exports = function (nodecg) {

	const display1 = nodecg.Replicant('display1');
	const display2 = nodecg.Replicant('display2');
	const display3 = nodecg.Replicant('display3');
	nodecg.log.info('Stage Displays Extension Starting Up...');

	// Listen for changes to the display1 replicant
	display1.on('change', (newVal) => {
		if (typeof newVal !== "undefined") {
			nodecg.log.info(`Display1 Changed: ${JSON.stringify(newVal)}`);
		}
	});

	// Listen for changes to the display2 replicant
	display2.on('change', (newVal) => {
		if (typeof newVal !== "undefined") {
			nodecg.log.info(`Display2 Changed: ${JSON.stringify(newVal)}`);
		}
	});

	// Listen for changes to the display3 replicant
	display3.on('change', (newVal) => {
		if (typeof newVal !== "undefined") {
			nodecg.log.info(`Display3 Changed: ${JSON.stringify(newVal)}`);
		}
	});


};
