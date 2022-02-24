/**
 * Seth Gunkel
 * https://github.com/sgunkel/Clock-Online
 */

 /**
  * Main Timer - keeps track of the time remaining in the quiz and also half times.
  */
let mainTimer = {
    seconds         : 0,
    minutes         : 6,
    valueToSet      : 6,
    isTicking       : false,
    tickingInterval : undefined,
    secElement      : document.getElementById('main-seconds'),
    minElement      : document.getElementById('main-minutes')
};

function handleRunningBorder() {

    let timeBox = document.getElementById('time');
    if (mainTimer.isTicking)
        timeBox.classList.add('time-running');
    else
        timeBox.classList.remove('time-running');
}

function showTime() {

    let secondsLeft = (mainTimer.seconds < 10.0) ?
                        `0${parseInt(mainTimer.seconds, 10)}` :
                        parseInt(mainTimer.seconds, 10).toString();

    mainTimer.secElement.textContent = secondsLeft;
    mainTimer.minElement.textContent = mainTimer.minutes.toString();
};

function tick() {

    // Automatically stops the main timer when time runs out.
    if (mainTimer.minutes == 0 && mainTimer.seconds == 0)
        stopTimer();
    else if (mainTimer.seconds == 0) {

        mainTimer.seconds = 59.5;
        mainTimer.minutes--;
    }
    else
        mainTimer.seconds -= 0.5;

    showTime();
}

function startTimer() {

    mainTimer.runningInterval = setInterval(tick, 500);
    document.getElementById('mainTimerBtn').textContent = 'Stop';
    mainTimer.isTicking = true;
    handleRunningBorder();
}

function stopTimer() {

    clearInterval(mainTimer.runningInterval);
    document.getElementById('mainTimerBtn').textContent = 'Start';
    mainTimer.isTicking = false;

    undoRedoHandler.addTime(mainTimer.minutes, mainTimer.seconds);
    handleRunningBorder();
}

function handleStartStop() {

    if (mainTimer.isTicking)
        stopTimer();
    else
        startTimer();
}

function addSec() {

    if (!mainTimer.isTicking) {

        if (mainTimer.seconds >= 59) {

            mainTimer.seconds = 0;
            mainTimer.minutes++;
        }
        else
            mainTimer.seconds++;
        showTime()
    }
}

function subSec() {

    if (!mainTimer.isTicking) {

        if (mainTimer.minutes == 0 && mainTimer.seconds == 0) {

            /* Intentionally empty. */
        }
        else if (mainTimer.seconds < 1) {

            mainTimer.seconds = 59;
            mainTimer.minutes--;
        }
        else
            mainTimer.seconds--;

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
    historyUndone : [],
    justUndone : false,
    tmp : [],
    addTime : function(min, sec) {
        this.history.push(`${min}:${sec}`);
        if (this.historyUndone.length > 0) {
            this.historyUndone = [];
            document.getElementById('redo-reset').textContent = 'Reset';
        }
        //this.printHistory();
    },
    subTime : function() {
        if (this.history.length > 1) {
            // Collect the time that was just undone in case the user wants to redo.
            this.historyUndone.push(String(this.history.splice(this.getHistorySize(), 1)));
            
            // Display the new time.
            this.changeTime(this.history[this.getHistorySize()]);

            // Display the option to redo this past undo action.
            document.getElementById('redo-reset').textContent = 'Redo';
            this.justUndone = true;
        }
        else {
            reset();
        }
        //this.printHistory();
    },
    redoTime : function () {
        if (this.historyUndone.length > 0) {
            // Get the last time frame the user pressed the stop button.
            this.history.push(String(this.historyUndone.splice(this.getUndoneSize(), 1)));

            // Correct and display the time.
            this.changeTime(this.history[this.getHistorySize()]);
            //this.printHistory();
        } else {
            document.getElementById('redo-reset').textContent = 'Reset';
            this.justUndone = false;
        }
    },
    changeTime : function(temp) {
        temp = String(temp).split(':');
        mainTimer.minutes = parseInt(temp[0]);
        mainTimer.seconds = parseFloat(temp[1]); // Seconds are floats as they are updated every 0.5 of a second.
        document.getElementById('redo-reset').textContent = 'Reset';
        showTime();
    },
    getUndoneSize : function() {
        return this.historyUndone.length - 1;
    },
    getHistorySize : function() {
        return this.history.length - 1;
    },
    printHistory : function() { // only for development
        console.log('\nHistory:');
        for (i = 0; i < this.history.length; i++) {
            console.log(this.history[i]);
        }
        console.log('Undone history:');
        for (i = 0; i < this.historyUndone.length; i++) {
            console.log(this.historyUndone[i]);
        }
    }
}

function handleResetRedo() {
    if (undoRedoHandler.justUndone) {
        undoRedoHandler.redoTime();
    } else {
        reset();
    }
}

function undo() {
    undoRedoHandler.subTime();
}

/**
 * Countdown - this will countdown the time from 20 seconds (or 30 for a quote)
 *     when a quizzer is answering.
 */
let Countdown = {
    seconds : 20,
    added10Seconds : false,
    isTicking : false,
    secondsInterval : undefined,
    countdownElement : undefined,
    tick : function() {
        this.seconds -= 0.1;
        this.countdownElement.textContent = this.seconds.toFixed(1);

        // Ran out of time.
        if (this.seconds <= 0) {
            RedoResetBtnHandler();
        }
    },
    start : function() {
        added10Seconds = false;
        seconds = 20;
        countdownElement = document.getElementById('countdown-seconds');
        this.secondsInterval = setInterval(this.tick, 100);
        this.isTicking = true;
    },
    stop : function() {
        clearInterval(this.secondsInterval);
        this.isTicking = false;
        added10Seconds = false;
    },
    add10 : function() {
        if (!this.added10Seconds) {
            seconds += 10;
            this.added10Seconds = true;
        }
    }
};

function RedoResetBtnHandler() {
    let status = '';
    if (Countdown.isTicking) {
        Countdown.stop();
        status = 'Start';
    } else {
        Countdown.start();
        status = 'Stop';
    }
    Countdown.added10Seconds = false;
    document.getElementById('countdown-start-stop-btn').textContent = status;
}

function quoteHandler() {
    Countdown.add10();
}

/**
 * handlerTimeChange will reset the main timer to a specific amount of time.
 */
function handleTimeChange() {
    let Continue = confirm('Start a new half?');
    if (Continue) {
        let selectedTime = document.getElementById('times');
        selectedTime = selectedTime.options[selectedTime.selectedIndex].value;
        mainTimer.minutes = selectedTime;
        mainTimer.valueToSet = selectedTime;
        mainTimer.seconds = 0;
        showTime();
    }
}

showTime();
document.getElementById('mainTimerBtn').addEventListener('click', handleStartStop);
document.getElementById('addSec').addEventListener('click', addSec);
document.getElementById('subSec').addEventListener('click', subSec);
document.getElementById('redo-reset').addEventListener('click', handleResetRedo);
document.getElementById('undo').addEventListener('click', undo);
document.getElementById('countdown-start-stop-btn').addEventListener('click', RedoResetBtnHandler);
document.getElementById('quote-btn').addEventListener('click', quoteHandler);
document.getElementById('times').addEventListener('change', handleTimeChange);

// Warns before reloading the page and losing the time.
window.onbeforeunload = function () {
    return "Reloading the page will lose the time left in the half. Continue?";
}