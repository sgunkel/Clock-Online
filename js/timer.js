/**
 * Seth Gunkel
 * 10/5/20
 * Last Updated on: 10/5/20
 */

 /**
  * Main Timer - keeps track of the time remaining in the quiz and also half times.
  */
let mainTimer = {
    seconds : 0,
    minutes : 6,
    valueToSet : 6,
    isTicking : false,
    tickingInterval : undefined,
    tmp : '',
    secElement : document.getElementById('main-seconds'),
    minElement : document.getElementById('main-minutes')
};

function showTime() {
    mainTimer.minElement.textContent = mainTimer.minutes;

    mainTimer.tmp = (mainTimer.seconds < 10.0) ?
        `0${parseInt(mainTimer.seconds, 10)}` :
        `${parseInt(mainTimer.seconds, 10)}`;
    mainTimer.secElement.textContent = mainTimer.tmp;
};

function tick() {
    if (mainTimer.seconds == 0) {
        mainTimer.seconds = 59.5;
        mainTimer.minutes--;
    } else {
        mainTimer.seconds -= 0.5;
    }
    showTime();
}

function startTimer() {
    mainTimer.runningInterval = setInterval(tick, 500);
    document.getElementById('mainTimerBtn').textContent = 'Stop';
    mainTimer.isTicking = true;
}

function stopTimer() {
    clearInterval(mainTimer.runningInterval);
    document.getElementById('mainTimerBtn').textContent = 'Start';
    mainTimer.isTicking = false;
}

function handleStartStop() {
    if (mainTimer.isTicking) {
        stopTimer();
    } else {
        startTimer();
    }
}

function addSec() {
    if (!mainTimer.isTicking) {
        if (mainTimer.seconds >= 59) {
            mainTimer.seconds = 0;
            mainTimer.minutes++;
        } else {
            mainTimer.seconds++;
        }
        showTime()
    }
}

function subSec() {
    if (!mainTimer.isTicking) {
        if (mainTimer.minutes == 0 && mainTimer.seconds == 0) {
            // Intentionally empty.
        } else if (mainTimer.seconds < 1) {
            mainTimer.seconds = 59;
            mainTimer.minutes--;
        } else {
            mainTimer.seconds--;
        }
        showTime();
    }
}

function reset() {
    if (!mainTimer.isTicking) {
        let choice = confirm('Reset the quiz?');
        if (choice) {
            mainTimer.minutes = mainTimer.valueToSet;
            mainTimer.seconds = 0;
            showTime();
        }
    }
}

/**
 * Handles all the times the user pressed stop and records it. If the user made a
 *  mistake, they can press the undo button and it will take them back to the last
 *  time they pressed stop.
 */
let undoRedoHandler = {
    history : [],
    index : 0,
    addTime : function(min, sec) {
        History.push(`${min}:${sec}`);
        index++;
    },
    subTime : function() {
        
    },
    printHistory : function() { // only for development
        console.log(history);
    }
}




function handleResetRedo() {
    reset();
}


showTime();
document.getElementById('mainTimerBtn').addEventListener('click', handleStartStop);
document.getElementById('addSec').addEventListener('click', addSec);
document.getElementById('subSec').addEventListener('click', subSec);
document.getElementById('redo-reset').addEventListener('click', handleResetRedo);