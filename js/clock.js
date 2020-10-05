/**
* Seth Gunkel
* 10/4/20
* Updated on 10/4/20;
*
*
*
*
*
*
*
*
*
*
*
*
*  DON'T USE THIS FILE!!!!
*   A more improved design is in the timer.js file. Work from there now.
*   This file is only used as a reference for some methods/functions and
*   will be deleted once it's needed no more.
*
*
*
*/

let mainTimer = {
    seconds : 0,
    minutes : 6,
    isTicking : false,
    valueToSet : '0',
    runningInterval : undefined,
    tmp : '',
    minElement : document.getElementById('main-minutes'),
    secElement : document.getElementById('main-seconds'),
    startBtn : document.getElementById('start-stop-main-timer-Btn'),
    showTime : function() {
        this.minElement.textContent = this.minutes;

        this.tmp = (this.seconds < 10.0) ? `0${parseInt(this.seconds, 10)}` : `${parseInt(this.seconds, 10)}`;
        this.secElement.textContent = this.tmp;
    },
    reset : function() {
        this.minutes = parseInt(this.valueToSet);
        this.seconds = 0;
    },
    start : function() {
        this.runningInterval = setInterval(tick, 500);
        this.startBtn.textContent = 'Stop';
        this.isTicking = true;
    },
    stop : function() {
        clearInterval(this.runningInterval);
        this.startBtn.textContent = 'Start';
        this.isTicking = false;
    },
    handleTime : function() {
        console.log('werkin');
        if (this.isTicking) {
            this.stop();
        } else {
            this.start();
        }
    },
    addSec : function() {
        if (!this.isTicking) {
            if (this.seconds === 59) {
                this.seconds = 0;
                this.minutes++;
            } else {
                this.seconds++;
            }
            this.showTime();
        }
    },
    subSec : function() {
        if (!this.isTicking) {
            if (this.minutes == 0 && this.seconds == 0) {
                // Intentionally empty.
            } else if (this.seconds == 0) {
                this.seconds = 59;
                this.minutes--;
            } else {
                this.seconds--;
            }
            this.showTime();
        }
    }
};

// Runs every 0.1 of a second.
function tick() {
    if (mainTimer.seconds == 0) {
        mainTimer.seconds = 59.5;
        mainTimer.minutes--;
    } else {
        mainTimer.seconds -= 0.5;
    }
    mainTimer.showTime();
}

function handleTimer() {
    if (mainTimer.isTicking) {
        mainTimer.stop();
    } else {
        mainTimer.start();
    }
}

mainTimer.showTime();
// Handlers
document.getElementById('mainTimerBtn').addEventListener('click', handleTimer);
document.getElementById('subSec').addEventListener('click', mainTimer.subSec);
document.getElementById('addSec').addEventListener('click', mainTimer.addSec);

/*console.log(mainTimer.minutes);
console.log(mainTimer.seconds);
mainTimer.tick();
console.log(mainTimer.minutes);
console.log(mainTimer.seconds);*/

function runTest() {
    mainTimer.handleStartStop();
    mainTimer.seconds = 15;
}