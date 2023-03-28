'use strict';

module.exports = function (nodecg) {
	const axios = require('axios');
	const Papa = require('papaparse');
	const googleSheetsURL = 'http://10.88.10.12/csv/VMIX_OUTPUT.csv';
	const rocketLeagueURL = 'http://10.88.10.12:3000/api/v1/interfaces/vmix';
	let doAutoUpdate = false;

	const logStateUpdates = false;

	// Setup Replicants
	const display1 = nodecg.Replicant('display1', { defaultValue: { "display_mode": "team", "team": { "name": "ETSU", "logo": "./assets/images/etsu.svg" } } });
	const display2 = nodecg.Replicant('display2', { defaultValue: { "display_mode": "vs" } });
	const display3 = nodecg.Replicant('display3', { defaultValue: { "display_mode": "team", "team": { "name": "ETSU", "logo": "./assets/images/etsu.svg" } } });
	const cavewall = nodecg.Replicant('cavewall', {
		defaultValue: {
			"left": {
				"display_mode": "score",
				"left": {
					"team": {
						"name": "ETSU",
						"logo": "./assets/images/etsu.svg"
					},
					"score": 0
				},
				"right": {
					"team": {
						"name": "King",
						"logo": "./assets/images/king.svg"
					},
					"score": 0
				}
			},
			"right": {
				"display_mode": "schedule",
				"schedule": [
					{
						"event": "Overwatch", "time": "8:15 AM", "active": true,
						"games":
							[
								{ "left": "King", "right": "ETSU" }
							]
					},
					{
						"event": "Rocket League", "time": "11:30 AM",
						"games":
							[
								{ "left": "NESCC", "right": "King" },
								{ "left": "King", "right": "ETSU" },
								{ "left": "ETSU", "right": "NESCC" }
							]
					},
					{
						"event": "Valorant", "time": "1:00 PM",
						"games":
							[
								{ "left": "NESCC", "right": "King" },
								{ "left": "King", "right": "ETSU" },
								{ "left": "ETSU", "right": "NESCC" }
							]
					},
				]
			}
		}
	});




	const teams = nodecg.Replicant('teams', {
		defaultValue: [
			{
				"id": "ETSU",
				"altID": "EASTTENNESSEE",
				"name": "ETSU",
				"longName": "East Tennessee State University",
				"image": "./assets/images/etsu.svg"
			},
			{
				"id": "KING",
				"altID": "KINGU",
				"name": "King",
				"longName": "King University",
				"image": "./assets/images/king.svg"
			},
			{
				"id": "NESCC",
				"altID": "NORTHEAST",
				"name": "NESCC",
				"longName": "Northeast State Community College",
				"image": "./assets/images/nescc.svg"
			}
		]
	});
	const autoUpdate = nodecg.Replicant('autoUpdate', { defaultValue: false });

	const googleSheets = nodecg.Replicant('googleSheets');
	const rocketLeague = nodecg.Replicant('rocketLeague');


	const resolveImageByID = (id) => {
		return new Promise((resolve, reject) => {
			const team = teams.value.find((team) => team.id == id || team.altID == id);
			if (team) {
				resolve(team.image);
			} else {
				reject(`Could not find image for team with id: ${id}`);
			}
		});
	};


	nodecg.log.info('Stage Displays Extension Starting Up...');

	// Listen for changes to the display1 replicant
	display1.on('change', (newVal) => {
		if (typeof newVal !== "undefined" && logStateUpdates) {
			nodecg.log.info(`Display1 Changed: ${JSON.stringify(newVal)}`);
		}
	});

	// Listen for changes to the display2 replicant
	display2.on('change', (newVal) => {
		if (typeof newVal !== "undefined" && logStateUpdates) {
			nodecg.log.info(`Display2 Changed: ${JSON.stringify(newVal)}`);
		}
	});

	// Listen for changes to the display3 replicant
	display3.on('change', (newVal) => {
		if (typeof newVal !== "undefined" && logStateUpdates) {
			nodecg.log.info(`Display3 Changed: ${JSON.stringify(newVal)}`);
		}
	});

	// Listen for changes to the teams replicant
	teams.on('change', (newVal) => {
		if (typeof newVal !== "undefined" && logStateUpdates) {
			nodecg.log.info(`Teams Changed: ${JSON.stringify(newVal)}`);
		}
	});

	// Listen for changes to the googleSheets replicant
	googleSheets.on('change', (newVal) => {
		if (typeof newVal !== "undefined" && logStateUpdates) {
			nodecg.log.info(`Google Sheets Changed: ${JSON.stringify(newVal)}`);
		}
	});

	// Listen for changes to the rocketLeague replicant
	rocketLeague.on('change', (newVal) => {
		if (typeof newVal !== "undefined" && logStateUpdates) {
			nodecg.log.info(`Rocket League Changed: ${JSON.stringify(newVal)}`);
		}
	});

	// Listen for changes to the autoUpdate replicant
	autoUpdate.on('change', (newVal) => {
		if (typeof newVal !== "undefined") {
			nodecg.log.info(`Auto Update Changed: ${JSON.stringify(newVal)}`);
			if (newVal) {
				doAutoUpdate = true;
			} else {
				doAutoUpdate = false;
			}
		}
	});
	// pull data from Google Sheets

	setInterval(() => {
		if(!doAutoUpdate) return; // Don't do anything if auto update is disabled
		
		getGoogleSheetsData().then((data) => {
			const parsedData = Papa.parse(data, { header: true, skipEmptyLines: true });
			const result = parsedData.data
				.filter(({ 'Data Name': dataName, 'Data Value': dataValue }) => dataName !== undefined && dataValue !== undefined && dataName.startsWith('NODECG_'))
				.map(({ 'Data Name': dataName, 'Data Value': dataValue }) => ({ [dataName]: dataValue }));
			googleSheets.value = Object.assign({}, ...result);
		}).catch((error) => {
			nodecg.log.error(`Error pulling data from Google Sheets: ${error}`);
		});

		if(googleSheets.value.NODECG_GAME == "Rocket League"){
			getRocketLeagueData().then((data) => {
				rocketLeague.value = data[0];
			}).catch((error) => {
				nodecg.log.error(`Error pulling data from Rocket League: ${error}`);
			});
		}
	}, 500);

	function getGoogleSheetsData() {
		return new Promise((resolve, reject) => {
			axios.get(googleSheetsURL).then
				(function (response) {
					resolve(response.data);
				}
				).catch(function (error) {
					reject(error);
				});
		});
	}

	function getRocketLeagueData() {
		return new Promise((resolve, reject) => {
			axios.get(rocketLeagueURL).then
				(function (response) {
					resolve(response.data);
				}
				).catch(function (error) {
					reject(error);
				});
		});
	}

	nodecg.listenFor('reset', (data, cb) => {
		nodecg.log.info('Resetting Replicants...');
		display1.value = { "display_mode": "etsuesports", "team": { "name": "ETSU", "logo": "./assets/images/etsu.svg" } };
		display2.value = { "display_mode": "etsuesports" };
		display3.value = { "display_mode": "etsuesports", "team": { "name": "ETSU", "logo": "./assets/images/etsu.svg" } };
		teams.value = [
			{
				"id": "ETSU",
				"name": "ETSU",
				"longName": "East Tennessee State University",
				"image": "./assets/images/etsu.svg"
			},
			{
				"id": "KING",
				"name": "King",
				"longName": "King University",
				"image": "./assets/images/king.svg"
			},
			{
				"id": "NESCC",
				"name": "NESCC",
				"longName": "Northeast State Community College",
				"image": "./assets/images/nescc.svg"
			}
		];
		cavewall.value = {
			"left": {
				"display_mode": "score",
				"left": {
					"team": {
						"name": "ETSU",
						"logo": "./assets/images/etsu.svg"
					},
					"score": 0
				},
				"right": {
					"team": {
						"name": "King",
						"logo": "./assets/images/king.svg"
					},
					"score": 0
				}
			},
			"right": {
				"display_mode": "schedule",
				"schedule": [
					{
						"event": "Overwatch", "time": "8:15 AM", "active": true,
						"games":
							[
								{ "left": "King", "right": "ETSU" }
							]
					},
					{
						"event": "Rocket League", "time": "11:30 AM",
						"games":
							[
								{ "left": "NESCC", "right": "King" },
								{ "left": "King", "right": "ETSU" },
								{ "left": "ETSU", "right": "NESCC" }
							]
					},
					{
						"event": "Valorant", "time": "1:00 PM",
						"games":
							[
								{ "left": "NESCC", "right": "King" },
								{ "left": "King", "right": "ETSU" },
								{ "left": "ETSU", "right": "NESCC" }
							]
					},
				]
			}
		};
		cb(null);
	});

	function doUpdateDisplays() {
		const data = nodecg.readReplicant('googleSheets', 'stagedisplays');
		resolveImageByID(data.NODECG_LEFT_TEAM).then((leftImage) => {
			resolveImageByID(data.NODECG_RIGHT_TEAM).then((rightImage) => {
				display1.value = {
					"display_mode": "score",
					"team": {
						"name": data.NODECG_LEFT_TEAM,
						"logo": leftImage
					},
					"score": data.NODECG_LEFT_SCORE
				};
				display3.value = {
					"display_mode": "score",
					"team": {
						"name": data.NODECG_RIGHT_TEAM,
						"logo": rightImage
					},
					"score": data.NODECG_RIGHT_SCORE
				};
				display2.value = { "display_mode": "vs" };
			});
		});
	}

	function doUpdateDisplaysRL() {
		const data = nodecg.readReplicant('rocketLeague', 'stagedisplays');
		const leftID = data.TEAM_L_NAME.toUpperCase();
		const rightID = data.TEAM_R_NAME.toUpperCase();
		resolveImageByID(leftID).then(async (leftImage) => {
			resolveImageByID(rightID).then(async (rightImage) => {
				display1.value = {
					"display_mode": "score",
					"team": {
						"name": data.TEAM_L_NAME,
						"logo": leftImage
					},
					"score": data.TEAM_L_SCORE
				};
				display3.value = {
					"display_mode": "score",
					"team": {
						"name": data.TEAM_R_NAME,
						"logo": rightImage
					},
					"score": data.TEAM_R_SCORE
				};
				display2.value = { "display_mode": "vs" };
			});
		});
	}

	function doUpdateCaveLeft() {
		const data = nodecg.readReplicant('googleSheets', 'stagedisplays');
		resolveImageByID(data.NODECG_LEFT_TEAM).then((leftImage) => {
			resolveImageByID(data.NODECG_RIGHT_TEAM).then((rightImage) => {
				cavewall.value.left = {
					"display_mode": "score",
					"left": {
						"team": {
							"name": data.NODECG_LEFT_TEAM,
							"logo": leftImage
						},
						"score": data.NODECG_LEFT_SCORE
					},
					"right": {
						"team": {
							"name": data.NODECG_RIGHT_TEAM,
							"logo": rightImage
						},
						"score": data.NODECG_RIGHT_SCORE
					}
				};
				// find the right game in cavewall.value.right.schedule and set active to true for it
				cavewall.value.right.schedule.forEach((game) => {
					if (game.event === googleSheets.value.NODECG_GAME) {
						game.active = true;
					} else {
						game.active = false;
					}
				});
			});
		});
	}

	function doUpdateCaveLeftRL() {
		const data = nodecg.readReplicant('rocketLeague', 'stagedisplays');
		const leftID = data.TEAM_L_NAME.toUpperCase();
		const rightID = data.TEAM_R_NAME.toUpperCase();
		resolveImageByID(leftID).then(async (leftImage) => {
			resolveImageByID(rightID).then(async (rightImage) => {
				cavewall.value.left = {
					"display_mode": "score",
					"left": {
						"team": {
							"name": data.TEAM_L_NAME,
							"logo": leftImage
						},
						"score": data.TEAM_L_SCORE
					},
					"right": {
						"team": {
							"name": data.TEAM_R_NAME,
							"logo": rightImage
						},
						"score": data.TEAM_R_SCORE
					}
				};
				// find the right game in cavewall.value.right.schedule and set active to true for it
				cavewall.value.right.schedule.forEach((game) => {
					if (game.event === googleSheets.value.NODECG_GAME) {
						game.active = true;
					} else {
						game.active = false;
					}
				});
			});
		});
	}

	setInterval(() => {
		if (doAutoUpdate) {
			/* nodecg.log.info(`Auto Update Triggered for ${googleSheets.value.NODECG_GAME}`); */
			switch (googleSheets.value.NODECG_GAME) {
				case "Rocket League":
					doUpdateDisplaysRL();
					doUpdateCaveLeftRL();
					break;
				case "Overwatch":
					doUpdateDisplays();
					doUpdateCaveLeft();
					break;
				case "Valorant":
					doUpdateDisplays();
					doUpdateCaveLeft();
					break;
				default:
					nodecg.log.info("No Game Selected");
					break;
			}
		}
	}, 1000);
};
