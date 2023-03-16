const display1 = nodecg.Replicant('display1');
const display2 = nodecg.Replicant('display2');
const display3 = nodecg.Replicant('display3');
const graphicInstances = nodecg.Replicant('graphics:instances', 'nodecg');
const teams = nodecg.Replicant('teams');
const googleSheets = nodecg.Replicant('googleSheets');
const rocketLeague = nodecg.Replicant('rocketLeague');
const autoUpdate = nodecg.Replicant('autoUpdate');

const modes = [{ value: "etsuesports", name: "ETSU Esports Logo" }, { value: "tricitiesslam", name: "Tri Cities Slam Logo" }, { value: "etsucon", name: "ETSU Con Logo" }, { value: "team", name: "Team Logos" }, { value: "vs", name: "VS Text" }, { value: "score", name: "Team Score" }];

let displayStatus = { display1: false, display2: false, display3: false };

$(document).ready(function () {
    graphicInstances.on('change', (newVal, oldVal) => {
        if (typeof newVal !== "undefined") {
            newVal.forEach(instance => {
                if (instance.bundleName == "stagedisplays") {
                    if (instance.pathName == "/bundles/stagedisplays/graphics/display1.html") {
                        $("#display1-status-light").removeClass("connected disconnected error").addClass("connected");
                        $("#display1-status-text").text("Connected");
                        displayStatus.display1 = true;
                    }
                    else if (instance.pathName == "/bundles/stagedisplays/graphics/display2.html") {
                        $("#display2-status-light").removeClass("connected disconnected error").addClass("connected");
                        $("#display2-status-text").text("Connected");
                        displayStatus.display2 = true;
                    }
                    else if (instance.pathName == "/bundles/stagedisplays/graphics/display3.html") {
                        $("#display3-status-light").removeClass("connected disconnected error").addClass("connected");
                        $("#display3-status-text").text("Connected");
                        displayStatus.display3 = true;
                    }
                }
            });
            if (!displayStatus.display1) {
                $("#display1-status-light").removeClass("connected disconnected error").addClass("disconnected");
                $("#display1-status-text").text("Disconnected");
            }
            if (!displayStatus.display2) {
                $("#display2-status-light").removeClass("connected disconnected error").addClass("disconnected");
                $("#display2-status-text").text("Disconnected");
            }
            if (!displayStatus.display3) {
                $("#display3-status-light").removeClass("connected disconnected error").addClass("disconnected");
                $("#display3-status-text").text("Disconnected");
            }
            displayStatus = { display1: false, display2: false, display3: false };
        }
    });

    display1.on('change', (newVal, oldVal) => {
        if (typeof newVal !== "undefined") {
            console.log('Display1 Changed:', newVal);
            updateControlPanel('display1', newVal);
        }
    });

    display2.on('change', (newVal, oldVal) => {
        if (typeof newVal !== "undefined") {
            console.log('Display2 Changed:', newVal);
            updateControlPanel('display2', newVal);
        }
    });

    display3.on('change', (newVal, oldVal) => {
        if (typeof newVal !== "undefined") {
            console.log('Display3 Changed:', newVal);
            updateControlPanel('display3', newVal);
        }
    });

    teams.on('change', (newVal, oldVal) => {
        if (typeof newVal !== "undefined") {
            console.log('Teams Changed:', newVal);
        }
    });

    googleSheets.on('change', (newVal, oldVal) => {
        if (typeof newVal !== "undefined") {
            console.log('Google Sheets Changed:', newVal);
            if (newVal.NODECG_GAME != "Rocket League") {
                changeAutoupdateSection(newVal);
            } else {
                nodecg.readReplicant('rocketLeague', value => {
                    changeAutoupdateSectionRL(value);
                });
            }
        }
    });

    rocketLeague.on('change', (newVal, oldVal) => {
        if (typeof newVal !== "undefined") {
            console.log('Rocket League Changed:', newVal);
            if (googleSheets.value.NODECG_GAME == "Rocket League") {
                changeAutoupdateSectionRL(newVal);
            }
        }
    });

    autoUpdate.on('change', (newVal, oldVal) => {
        if (typeof newVal !== "undefined") {
            console.log('Auto Update Changed:', newVal);
            if (newVal) {
                $("#auto_update").prop('checked', true);
                $("#auto_update_status").text("is ON");
                $("#display1-mode-select").addClass("displayControlDisabled");
                $("#display2-mode-select").addClass("displayControlDisabled");
                $("#display3-mode-select").addClass("displayControlDisabled");
                $("#display1-settings").addClass("displayControlDisabled");
                $("#display2-settings").addClass("displayControlDisabled");
                $("#display3-settings").addClass("displayControlDisabled");

            }
            else {
                $("#auto_update").prop('checked', false);
                $("#auto_update_status").text("is OFF");
                $("#display1-mode-select").removeClass("displayControlDisabled");
                $("#display2-mode-select").removeClass("displayControlDisabled");
                $("#display3-mode-select").removeClass("displayControlDisabled");
                $("#display1-settings").removeClass("displayControlDisabled");
                $("#display2-settings").removeClass("displayControlDisabled");
                $("#display3-settings").removeClass("displayControlDisabled");
            }
        }
    });


    $("#display1-mode-select").on('click', 'input', function () {
        switch (this.value) {
            case "team":
                nodecg.readReplicant('teams', value => {
                    displayTeams(value, 'display1');
                });
                break;
            case "score":
                nodecg.readReplicant('teams', value => {
                    displayScores(value, 'display1');
                });
            default:
                $("#display1-settings").html(`<h4>No Settings Available</h4>`);
                break;
        }
    });
    $("#display2-mode-select").on('click', 'input', function () {
        switch (this.value) {
            case "team":
                nodecg.readReplicant('teams', value => {
                    displayTeams(value, 'display2');
                });
                break;
            case "score":
                nodecg.readReplicant('teams', value => {
                    displayScores(value, 'display2');
                });
            default:
                $("#display2-settings").html(`<h4>No Settings Available</h4>`);
                break;
        }
    });
    $("#display3-mode-select").on('click', 'input', function () {
        switch (this.value) {
            case "team":
                nodecg.readReplicant('teams', value => {
                    displayTeams(value, 'display3');
                });
                break;
            case "score":
                nodecg.readReplicant('teams', value => {
                    displayScores(value, 'display3');
                });
            default:
                $("#display3-settings").html(`<h4>No Settings Available</h4>`);
                break;
        }
    });

    $("#auto_update").change(function () {
        console.log(this.checked);
        autoUpdate.value = this.checked;
    });

});

function updateControlPanel(display, values) {
    const modeDisplay = modes.find(mode => mode.value == values.display_mode);
    $(`#${display}-mode`).text(modeDisplay.name);

    let modeOptions = "";
    modes.forEach(mode => {
        modeOptions += `<div class="form-check"><input class="form-check-input" type="radio" name="${display}-mode-radio" id="${display}-mode-radio-${mode.value}" value="${mode.value}" ${(mode.value == values.display_mode) ? 'checked' : ''}><label class="form-check-label" class="mode_select" for="${display}-mode-radio-${mode.value}">${mode.name}</label></div>`;
    });
    $(`#${display}-mode-select`).html(`<h4>Mode</h4><form><div class="form-group">${modeOptions}</div></form>`);
    if (values.display_mode == "team") {
        nodecg.readReplicant('teams', value => {
            displayTeams(value, display);
        });
    }
    else if (values.display_mode == "score") {
        nodecg.readReplicant('teams', value => {
            displayScores(value, display);
        });
    }
    else {
        $(`#${display}-settings`).html(`<h4>No Settings Available</h4>`);
    }
}

async function updateDisplays() {
    console.log('Updating displays...');
    display1.value = await setDisplayInput('display1');
    display2.value = await setDisplayInput('display2');
    display3.value = await setDisplayInput('display3');
}

function reset() {
    nodecg.sendMessage('reset');
}

function resolveImage(name) {
    return new Promise((resolve, reject) => {
        nodecg.readReplicant('teams', value => {
            resolve(value.find(team => team.name == name).image);
        });
    });
}

function resolveImageByID(id) {
    console.log(`Resolving image for ${id}`);
    return new Promise((resolve, reject) => {
        nodecg.readReplicant('teams', value => {
            resolve(value.find(team => team.id == id).image);
        });
    });
}

function getTeam(name) {
    return new Promise((resolve, reject) => {
        nodecg.readReplicant('teams', value => {
            resolve(value.find(team => team.name == name));
        });
    });
}

async function setDisplayInput(display) {
    const mode = $(`input[name="${display}-mode-radio"]:checked`).val();
    let teamName = "";
    let score = "";
    console.log(mode);
    switch (mode) {
        case "etsuesports":
            return {
                "display_mode": "etsuesports"
            };
        case "tricitiesslam":
            return {
                "display_mode": "tricitiesslam"
            };
        case "etsucon":
            return {
                "display_mode": "etsucon"
            };
        case "team":
            teamName = $(`input[name="${display}-team-radio"]:checked`).val();
            return {
                "display_mode": "team",
                "team": {
                    "name": teamName,
                    "logo": await resolveImage(teamName)
                }
            };
        case "vs":
            return {
                "display_mode": "vs"
            };
        case "score":
            teamName = $(`input[name="${display}-team-radio"]:checked`).val();
            score = $(`#${display}-score-input`).val();
            return {
                "display_mode": "score",
                "team": {
                    "name": teamName,
                    "logo": await resolveImage(teamName)
                },
                "score": score
            };
        default:
            return {
                "display_mode": "etsuesports"
            };
    }
}

function displayTeams(teams, display) {
    nodecg.readReplicant(display, values => {
        let teamOptions = "";
        teams.forEach(element => {
            teamOptions += `<label class="labl"><input type="radio" name="${display}-team-radio" id="${display}-team-radio-${element.name}" value="${element.name}" ${(values.team && values.team.name == element.name) ? 'checked' : ''}><div class="team_select_option" style="background-image: url('../graphics/${element.image}')"></div><div class="team_select_name">${element.name}</div></label>`;
        });
        $(`#${display}-settings`).html(`<h4>Team</h4><form><div class="form-group team_select_container">${teamOptions}</div></form>`);
    });
}

function displayScores(teams, display) {
    nodecg.readReplicant(display, values => {
        let teamOptions = "";
        teams.forEach(element => {
            teamOptions += `<label class="labl"><input type="radio" name="${display}-team-radio" id="${display}-team-radio-${element.name}" value="${element.name}" ${(values.team && values.team.name == element.name) ? 'checked' : ''}><div class="team_select_option" style="background-image: url('../graphics/${element.image}')"></div><div class="team_select_name">${element.name}</div></label>`;
        });
        const scoreInput = `<div class="form-group"><label for="${display}-score-input">Score (0-9)</label><input type="number" min="0" max="9" class="form-control" id="${display}-score-input" placeholder="Enter score" value="${(values && values.score) ? values.score : ''}"></div>`;
        $(`#${display}-settings`).html(`<h4>Team</h4><form><div class="form-group team_select_container">${teamOptions}</div>${scoreInput}</form>`);
    });
}

async function changeAutoupdateSection(value) {
    $("#current_game").text(value.NODECG_GAME);
    $("#auto_game_image").attr("src", `../graphics/assets/images/${value.NODECG_GAME}.svg`);
    $("#auto_left_name").text(value.NODECG_LEFT_TEAM);
    $("#auto_right_name").text(value.NODECG_RIGHT_TEAM);
    $("#auto_left_score").text(value.NODECG_LEFT_SCORE);
    $("#auto_right_score").text(value.NODECG_RIGHT_SCORE);
    $("#auto_left_image").attr("src", `../graphics/${await resolveImageByID(value.NODECG_LEFT_TEAM)}`);
    $("#auto_right_image").attr("src", `../graphics/${await resolveImageByID(value.NODECG_RIGHT_TEAM)}`);
}

async function changeAutoupdateSectionRL(value) {
    $("#current_game").text("Rocket League");
    $("#auto_game_image").attr("src", "../graphics/assets/images/Rocket League.svg");
    $("#auto_left_name").text(value.TEAM_L_NAME.toUpperCase());
    $("#auto_right_name").text(value.TEAM_R_NAME.toUpperCase());
    $("#auto_left_score").text(value.TEAM_L_SCORE);
    $("#auto_right_score").text(value.TEAM_R_SCORE);
    $("#auto_left_image").attr("src", `../graphics/${await resolveImageByID(value.TEAM_L_NAME.toUpperCase())}`);
    $("#auto_right_image").attr("src", `../graphics/${await resolveImageByID(value.TEAM_R_NAME.toUpperCase())}`);
}