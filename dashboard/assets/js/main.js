const display1 = nodecg.Replicant('display1');
const display2 = nodecg.Replicant('display2');
const display3 = nodecg.Replicant('display3');
const teams = nodecg.Replicant('teams');

const modes = [{ value: "etsuesports", name: "ETSU Esports Logo" }, { value: "tricitiesslam", name: "Tri Cities Slam Logo" }, { value: "etsucon", name: "ETSU Con Logo" }, { value: "team", name: "Team Logos" }, { value: "vs", name: "VS Text" }, { value: "score", name: "Score" }];

$(document).ready(function () {
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

    $("#display1-mode-select").on('click', 'input', function () {
        switch (this.value) {
            case "team":
                nodecg.readReplicant('teams', value => {
                    let teamOptions = "";
                    value.forEach(element => {
                        teamOptions += `<div class="form-check"><input class="form-check-input" type="radio" name="display1-team-radio" id="display1-team-radio-${element.name}" value="${element.name}"><label class="form-check-label" for="display1-team-radio-${element.name}">${element.name}</label></div>`;
                    });
                    $("#display1-settings").html(`<h4>Team</h4><form><div class="form-group">${teamOptions}</div></form>`);
                });
                break;
            case "score":
                $("#display1-settings").html(`<h4>Score</h4><h5>No Settings Available</h5>`);
                break;
            default:
                $("#display1-settings").html(`<h4>No Settings Available</h4>`);
                break;
        }
    });
    $("#display2-mode-select").on('click', 'input', function () {
        switch (this.value) {
            case "team":
                nodecg.readReplicant('teams', value => {
                    let teamOptions = "";
                    value.forEach(element => {
                        teamOptions += `<div class="form-check"><input class="form-check-input" type="radio" name="display2-team-radio" id="display2-team-radio-${element.name}" value="${element.name}"><label class="form-check-label" for="display2-team-radio-${element.name}">${element.name}</label></div>`;
                    });
                    $("#display2-settings").html(`<h4>Team</h4><form><div class="form-group">${teamOptions}</div></form>`);
                });
                break;
            case "score":
                $("#display2-settings").html(`<h4>Score</h4><h5>No Settings Available</h5>`);
                break;
            default:
                $("#display2-settings").html(`<h4>No Settings Available</h4>`);
                break;
        }
    });
    $("#display3-mode-select").on('click', 'input', function () {
        switch (this.value) {
            case "team":
                nodecg.readReplicant('teams', value => {
                    let teamOptions = "";
                    value.forEach(element => {
                        teamOptions += `<div class="form-check"><input class="form-check-input" type="radio" name="display3-team-radio" id="display3-team-radio-${element.name}" value="${element.name}"><label class="form-check-label" for="display3-team-radio-${element.name}">${element.name}</label></div>`;
                    });
                    $("#display3-settings").html(`<h4>Team</h4><form><div class="form-group">${teamOptions}</div></form>`);
                });
                break;
            case "score":
                $("#display3-settings").html(`<h4>Score</h4><h5>No Settings Available</h5>`);
                break;
            default:
                $("#display3-settings").html(`<h4>No Settings Available</h4>`);
                break;
        }
    });

});


function updateControlPanel(display, values) {
    $(`#${display}-mode`).text(values.display_mode);
    let modeOptions = "";
    modes.forEach(mode => {
        modeOptions += `<div class="form-check"><input class="form-check-input" type="radio" name="${display}-mode-radio" id="${display}-mode-radio-${mode}" value="${mode.value}" ${(mode.value == values.display_mode) ? 'checked' : ''}><label class="form-check-label" class="mode_select" for="${display}-mode-radio-${mode.value}">${mode.name}</label></div>`;
    });

    $(`#${display}-mode-select`).html(
        `<h4>Mode</h4>
        <form>
        <div class="form-group">
            ${modeOptions}
        </div>
        </form>`
    );


    if (values.display_mode == "team") {
        nodecg.readReplicant('teams', value => {
            let teamOptions = "";
            value.forEach(element => {
                teamOptions += `<div class="form-check"><input class="form-check-input" type="radio" name="${display}-team-radio" id="${display}-team-radio-${element.name}" value="${element.name}" ${(values.team.name == element.name) ? 'checked' : ''}><label class="form-check-label" for="${display}-team-radio-${element.name}">${element.name}</label></div>`;
            });
            $(`#${display}-settings`).html(
                `<h4>Team</h4>
                <form>
                <div class="form-group">
                    ${teamOptions}
                </div>
                </form>`
            );
        });
    }
}

async function updateDisplays() {
    console.log('Updating displays...');
    display1.value = await getDisplayInput('display1');
    display2.value = await getDisplayInput('display2');
    display3.value = await getDisplayInput('display3');

}

function reset() {
    display1.value = { "display_mode": "team", "team": { "name": "ETSU", "logo": "./assets/images/etsu.svg" } };
    display2.value = { "display_mode": "vs" };
    display3.value = { "display_mode": "team", "team": { "name": "ETSU", "logo": "./assets/images/etsu.svg" } };
}

function resolveImage(name) {
    return new Promise((resolve, reject) => {
        nodecg.readReplicant('teams', value => {
            resolve(value.find(team => team.name == name).image);
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

async function getDisplayInput(display) {
    const mode = $(`input[name="${display}-mode-radio"]:checked`).val();
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
            const teamName = $(`input[name="${display}-team-radio"]:checked`).val();
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
            return {
                "display_mode": "score"
            };
    }
}