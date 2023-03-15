const display2 = nodecg.Replicant('display2');

$(document).ready(function() {
    display2.on('change', (newVal, oldVal) => {
        if(typeof newVal !== "undefined"){
            console.log('Display2 Changed:', newVal);
            updateScreen(newVal);
        }
    });
});
