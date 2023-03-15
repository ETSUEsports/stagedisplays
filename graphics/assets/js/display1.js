const display1 = nodecg.Replicant('display1');

$(document).ready(function() {
    display1.on('change', (newVal, oldVal) => {
        if(typeof newVal !== "undefined"){
            console.log('Display1 Changed:', newVal);
            updateScreen(newVal);
        }
    });
});
