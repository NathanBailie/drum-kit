'use strict';

const buttons = document.querySelectorAll('.button');
const recordButton = document.querySelector('.button.record');
const playButton = document.querySelector('.button.play');
const base = './assets/sounds/';
const sounds = {
	KeyA: `${base}clap.wav`,
	KeyS: `${base}hihat.wav`,
	KeyD: `${base}kick.wav`,
	KeyF: `${base}openhat.wav`,
	KeyG: `${base}boom.wav`,
	KeyH: `${base}ride.wav`,
	KeyJ: `${base}snare.wav`,
	KeyK: `${base}tom.wav`,
	KeyL: `${base}tink.wav`,
};
const keys = Object.keys(sounds);
let pressedBtnsKeyCodes = [];
let timings = [];
let isRecording = false;
let isPlaying = false;

function toggleButton(button, active) {
	button.classList[active ? 'add' : 'remove']('active');
}

function keyPressHandle(keyCode) {
	if (!keys.includes(String(keyCode))) return;

	const button = document.querySelector(`.button[data-key="${keyCode}"]`);
	toggleButton(button, true);
	onPlaySound(keyCode);

	if (isRecording) {
		onRecord(keyCode);
	}

	document.addEventListener('keyup', () => toggleButton(button, false), {
		once: true,
	});
}

function onRecordHandler() {
	isRecording = !isRecording;
	if (!isRecording) {
		toggleButton(recordButton, false);
		recordButton.querySelector('.sound').textContent = 'record';
		return;
	}

	pressedBtnsKeyCodes = [];
	timings = [];
	toggleButton(recordButton, true);
	recordButton.querySelector('.sound').textContent = 'stop';
	toggleButton(playButton, false);
}

function onRecord(keyCode) {
	pressedBtnsKeyCodes.push(keyCode);
	timings.push(Date.now());
}

function onPlayRecord() {
	if (timings.length === 0 || isPlaying) return;

	isPlaying = true;
	toggleButton(playButton, true);

	const timeDifferences = onCalcTimeDiffs(timings);
	let finalTimeout = 0;

	timeDifferences.forEach((diff, i) => {
		finalTimeout += diff;
		setTimeout(() => onPlaySound(pressedBtnsKeyCodes[i]), finalTimeout);
	});

	setTimeout(() => {
		toggleButton(playButton, false);
		isPlaying = false;
	}, finalTimeout + 400);
}

function onCalcTimeDiffs(timeArray) {
	return [0, ...timeArray.slice(1).map((time, i) => time - timeArray[i])];
}

function onPlaySound(key) {
	new Audio(sounds[key]).play();
}

document.addEventListener('keydown', e => {
	keyPressHandle(e.code);
	if (e.code === 'KeyR') onRecordHandler();
	else if (e.code === 'KeyP') onPlayRecord();
});

document.addEventListener('click', e => {
	const button =
		e.target.tagName === 'SPAN' ? e.target.closest('BUTTON') : e.target;
	const keyCode = button.dataset.key;

	keyPressHandle(keyCode);
	if (keys.includes(String(keyCode))) {
		toggleButton(button, false);
	}
});

recordButton.addEventListener('click', () => {
	onRecordHandler();
	toggleButton(playButton, false);
});

playButton.addEventListener('click', () => {
	onPlayRecord();
	toggleButton(recordButton, false);
});
