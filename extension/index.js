'use strict';

module.exports = function (nodecg) {

	// Setup Replicants
	const display1 = nodecg.Replicant('display1', { defaultValue: { "display_mode": "team", "team": { "name": "ETSU", "logo": "./assets/images/etsu.svg" } } });
	const display2 = nodecg.Replicant('display2', { defaultValue: { "display_mode": "vs" } });
	const display3 = nodecg.Replicant('display3', { defaultValue: { "display_mode": "team", "team": { "name": "ETSU", "logo": "./assets/images/etsu.svg" } } });
	const teams = nodecg.Replicant('teams', {
		defaultValue: [
			{
				"name": "ETSU",
				"longName": "East Tennessee State University",
				"image": "./assets/images/etsu.svg"
			},
			{
				"name": "King",
				"longName": "King University",
				"image": "./assets/images/king.svg"
			},
			{
				"name": "NESCC",
				"longName": "Northeast State Community College",
				"image": "./assets/images/nescc.svg"
			}
		]
	});
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

	// Listen for changes to the teams replicant
	teams.on('change', (newVal) => {
		if (typeof newVal !== "undefined") {
			nodecg.log.info(`Teams Changed: ${JSON.stringify(newVal)}`);
		}
	});


};
