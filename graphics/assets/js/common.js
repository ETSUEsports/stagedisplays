function showTeam(name, image) {
    $('#container').data('display-mode', 'team');
    $("#container").html(`<div class="team"><img id="team_logo" src="${image}" class="team_logo" alt="Team logo"></div>`);
}

function showScore(name, image, score) {
    $('#container').data('display-mode', 'score');
    $("#container").html(`<div class="score"><div class="score_left"><img id="score_logo" src="${image}" class="score_logo" alt="Team logo"></div><div class="score_middle"><span class="score_separator">—</span></div><div class="score_right"><div class="score_text">${score}</div></div></div>`);
}

function showVs() {
    $('#container').data('display-mode', 'vs');
    $("#container").html(`<div class="vs"><img id="vs_icon" src="./assets/images/vs.svg" class="vs_icon"></div>`);
}

function showETSUEsports() {
    $('#container').data('display-mode', 'etsuesports');
    $("#container").html(`<div class="etsuesports"><img id="etsuesports_logo" src="./assets/images/etsuesports.svg" class="etsuesports_logo"></div>`);
}

function showTricitiesSlam() {
    $('#container').data('display-mode', 'tricitiesslam');
    $("#container").html(`<div class="tricitiesslam"><img id="tricitiesslam_logo" src="./assets/images/tricitiesslam.png" class="tricitiesslam_logo"></div>`);
}

function showETSUCon() {
    $('#container').data('display-mode', 'etsucon');
    $("#container").html(`<div class="etsucon"><img id="etsucon_logo" src="./assets/images/etsucon.png" class="etsucon_logo"></div>`);
}

function updateScreen(values) {
    switch (values.display_mode) {
        case "etsuesports":
            console.log("Showing etsuesports");
            showETSUEsports();
            break;
        case "tricitiesslam":
            console.log("Showing tricitiesslam");
            showTricitiesSlam();
            break;
        case "etsucon":
            console.log("Showing etsucon");
            showETSUCon();
            break;
        case "team":
            console.log(`Showing team with name ${values.team.name} and logo ${values.team.logo}`);
            showTeam(values.team.name, values.team.logo);
            break;
        case "vs":
            console.log("Showing vs");
            showVs();
            break;
        case "score":
            console.log(`Showing score with name ${values.team.name} and logo ${values.team.logo} and score ${values.score}`);
            showScore(values.team.name, values.team.logo, values.score);
            break;
        default:
            console.log("Showing etsuesports");
            showETSUEsports();
            break
    }

}