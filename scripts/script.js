"use strict"

let buttons = document.querySelectorAll('.button');
let recordButton = document.querySelector('.button.record');
let playButton = document.querySelector('.button.play');
let base = './assets/sounds/';
let sounds = {
    'KeyA': `${base}clap.wav`,
    'KeyS': `${base}hihat.wav`,
    'KeyD': `${base}kick.wav`,
    'KeyF': `${base}openhat.wav`,
    'KeyG': `${base}boom.wav`,
    'KeyH': `${base}ride.wav`,
    'KeyJ': `${base}snare.wav`,
    'KeyK': `${base}tom.wav`,
    'KeyL': `${base}tink.wav`
};
let keys = Object.keys(sounds);
let pressedBtnsKeyCodes = [];
let timings = [];
let isRecording = false;
let isPlaying = false;


function keyPressHandle(keyCode) {
    let button;

    if (keys.includes(String(keyCode))) {
        button = document.querySelector(`.button[data-key="${keyCode}"]`);
        button.classList.add("active");
        onPlaySound(keyCode);

        if (isRecording) {
            onRecord(keyCode);
        };
    }

    document.addEventListener("keyup", () => {
        if (keys.includes(String(keyCode))) {
            button.classList.remove("active");
        }
    });
}

function onRecordHandler() {
    if (isRecording) {
        isRecording = false;
        recordButton.classList.remove("active");
        return;
    } else {
        pressedBtnsKeyCodes = [];
        timings = [];
        isRecording = true;
        recordButton.classList.add("active");
        playButton.classList.remove("active");
    }
}

function onRecord(keyCode) {
    pressedBtnsKeyCodes.push(keyCode);
    timings.push(Date.now());
}

function onPlayRecord() {
    let finalTimeout = 0;
    let timeDifferences = onCalcTimeDiffs(timings);

    if (timings.length === 0 || isPlaying) {
        return;
    }

    isPlaying = true;
    playButton.classList.add("active");

    for (let i = 0; i < timeDifferences.length; i++) {
        finalTimeout += timeDifferences[i];

        setTimeout(() => {
            onPlaySound(pressedBtnsKeyCodes[i]);
        }, finalTimeout);
    }

    setTimeout(() => {
        playButton.classList.remove("active");
        isPlaying = false;
    }, finalTimeout + 0.4);
}

function onCalcTimeDiffs(timeArray) {
    let newArray = [0];

    for (let i = 0; i < timeArray.length - 1; i++) {
        if (timeArray[i + 1] !== undefined) {
            newArray.push((timeArray[i + 1] - timeArray[i]));
        }
    }

    return newArray;
}

function onPlaySound(key) {
    let audio = new Audio(sounds[key]);
    audio.autoplay = true;
    audio.play();
};


// for keyboard
document.addEventListener("keydown", (e) => {
    keyPressHandle(e.code);

    if (e.code === "KeyR") {
        onRecordHandler();
    } else if (e.code === "KeyP") {
        // onPlayHandler();
        onPlayRecord();
    }
});

// for mouse
document.addEventListener('click', (e) => {
    let button;

    if (e.target.tagName === "SPAN") {
        button = e.target.closest("BUTTON");
    } else {
        button = e.target;
    }

    keyPressHandle(button.dataset.key);

    if (keys.includes(String(button.dataset.key))) {
        button.classList.remove("active");
    }
})

recordButton.addEventListener('click', () => {
    onRecordHandler();
    playButton.classList.remove("active");

    isRecording
        ? recordButton.classList.add("active")
        : recordButton.classList.remove("active")
})

playButton.addEventListener('click', () => {
    onPlayRecord();
    recordButton.classList.remove("active")
})