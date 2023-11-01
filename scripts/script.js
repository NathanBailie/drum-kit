"use strict"

let buttons = document.querySelectorAll('.button');
let base = './assets/sounds/';
let sounds = {
    '65': `${base}clap.wav`,
    '83': `${base}hihat.wav`,
    '68': `${base}kick.wav`,
    '70': `${base}openhat.wav`,
    '71': `${base}boom.wav`,
    '72': `${base}ride.wav`,
    '74': `${base}snare.wav`,
    '75': `${base}tom.wav`,
    '76': `${base}tink.wav`
};
let keys = Object.keys(sounds);

function keyPressHandle(e) {
    let keyCode = e.keyCode;
    let button;

    if (keys.includes(String(keyCode))) {
        button = document.querySelector(`.button[data-key="${keyCode}"]`);
        button.classList.add("active");
        onPlaySound(keyCode);
    }

    document.addEventListener("keyup", () => {
        if (keys.includes(String(keyCode))) {
            button.classList.remove("active");
        }
    });
}

for (let button of buttons) {
    button.addEventListener('click', () => {
        onPlaySound(button.dataset.key)
    })
}

function onPlaySound(key) {
    let audio = new Audio(sounds[key]);
    audio.autoplay = true;
    audio.play();
};

document.addEventListener("keydown", keyPressHandle);