const display3 = nodecg.Replicant('display3');

$(document).ready(function() {
    display3.on('change', (newVal, oldVal) => {
        if(typeof newVal !== "undefined"){
            console.log('Display3 Changed:', newVal);
            updateScreen(newVal);
        }
    });
});
