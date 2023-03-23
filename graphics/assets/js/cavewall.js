const cavewall = nodecg.Replicant('cavewall');

$(document).ready(function() {
    cavewall.on('change', (newVal, oldVal) => {
        if(typeof newVal !== "undefined"){
            console.log('Cavewall Changed:', newVal);
            updateWallLeft(newVal.left);
            updateWallRight(newVal.right);
        }
    });
});


function updateWallLeft(data) {
    switch(data.display_mode){
        case "score":
            displayCurrentGame(data);
            break;
    }
}

function updateWallRight(data) {
    switch(data.display_mode){
        case "schedule":
            displaySchedule(data.schedule);
            break;

    }
}




async function displaySchedule(data){
    let html = '<div id="schedule">';

   for(let i = 0; i < data.length; i++){
         const item = data[i];
            html += `
            <div class="schedule_item ${(item.active) ? "active" : ""}">
            <div class="schedule_header">

                <h4>${item.time}</h4>
                <h2>${item.event}</h2>
            </div>
            <div class="schedule_body" >
            `;
            for(let j = 0; j < item.games.length; j++){
                const game = item.games[j];
                const left = await resolveImageByID(game.left.toUpperCase());
                const right = await resolveImageByID(game.right.toUpperCase());
                html += `
                <div class="schedule_matchup">
                    <img class="schedule_team" src="${left}">
                    <img class="schedule_vs" src="./assets/images/vs.svg">
                    <img class="schedule_team" src="${right}">
                </div>
                `;
            }
            html += `
            </div>
        </div>
            `;
    }
    
    html += '</div>';
    
    $("#right_container").html(html);

}

async function displayCurrentGame(data){
    console.log(data);
    const left = await resolveImageByID(data.left.team.name.toUpperCase());
    const right = await resolveImageByID(data.right.team.name.toUpperCase());
    console.log(left, right);
    let html = `
    <h1>Current Game</h1>
    <div class="left_team">
        <img class="img_left" src="${left}">
        <span class="score_separator">—</span>
        <h1 class="score">${data.left.score}</h1>
    </div>
    <img class="img_vs" src="./assets/images/vs.svg">
    <div class="right_team">
        <img class="img_right" src="${right}">
        <span class="score_separator">—</span>
        <h1 class="score">${data.right.score}</h1>
    </div>
    `;
    $("#left_info").html(html);
}

function resolveImageByID(id) {
    return new Promise((resolve, reject) => {
        nodecg.readReplicant('teams', value => {
            resolve(value.find(team => team.id == id).image);
        });
    });
}
