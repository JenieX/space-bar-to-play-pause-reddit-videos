// ==UserScript==
// @name           Reddit Videos - [Space Bar] to Play/Pause
// @namespace      https://github.com/FlowerForWar/Reddit-Videos-Space-Bar-to-Play-Pause
// @description    Play/Pause a focused video by pressing the [Space Bar]. Automatically focus an auto-playing video
// @version        0.05
// @author         FlowrForWar
// @match          https://www.reddit.com/*
// @grant          none
// @compatible     edge Tampermonkey or Violentmonkey
// @compatible     firefox Greasemonkey, Tampermonkey or Violentmonkey
// @compatible     chrome Tampermonkey or Violentmonkey
// @compatible     opera Tampermonkey or Violentmonkey
// @supportURL     https://github.com/FlowerForWar/Reddit-Videos-Space-Bar-to-Play-Pause/issues
// @license        MIT
// ==/UserScript==

/*

## Some notes on how it works
* Video losing focus, means the default behavior of Space Bar is activated, that is scrolling down
* Video loses focus in these situations
  * When the video is finished playing
  * When the video is auto-paused by scrolling down
  * When the video is paused by click and this script has been triggerd at least once on that video

*/

let fullscreenElement, pausedByScript;
document.documentElement.addEventListener('fullscreenchange', () => {
	const fullscreen_had_video = !!fullscreenElement && !!fullscreenElement.querySelector(':scope > video');
	if (fullscreen_had_video) fullscreenElement.closest('[id^="t3_"]').focus();
	fullscreenElement = document.fullscreenElement;
});
window.addEventListener('keydown', keydown);

// https://stackoverflow.com/a/31133401
Object.defineProperty(HTMLMediaElement.prototype, 'playing', {
	get: function() {
		return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
	},
});

async function keydown(event) {
	const { code: key, shiftKey } = event;
	if (key !== 'Space' && key !== 'ArrowLeft' && key !== 'ArrowRight') return;
	const playing_video = [...document.getElementsByTagName('video')].filter(video => video.playing)[0];
	if (playing_video) playing_video.closest('[id^="t3_"]').focus();
	if (!(document.activeElement && document.activeElement.id.startsWith('t3_')) && !fullscreenElement) return;
	const video = fullscreenElement ? fullscreenElement.querySelector(':scope > video') : document.activeElement.getElementsByTagName('video')[0];
	if (!video) return;
	event.preventDefault();
	switch (key) {
		case 'Space':
			if (shiftKey) {
				video.currentTime = 0;
				video.play();
			} else if (video.paused) {
				video.play();
			} else {
				pausedByScript = !0;
				video.pause();
			}
			break;
		case 'ArrowLeft':
			video.currentTime -= shiftKey ? 10 : 2;
			break;
		case 'ArrowRight':
			video.currentTime += shiftKey ? 10 : 2;
			break;
	}
	video.addEventListener('pause', pause);
	video.addEventListener('play', play);
	video.dispatchEvent(new MouseEvent('mousemove', { bubbles: !0 }));
}

function pause() {
	if (pausedByScript) return;
	// console.warn('Lost focus');
	document.activeElement.blur();
	// this.removeEventListener('pause', pause);
}

function play() {
	pausedByScript = !1;
	// this.removeEventListener('play', play);
}
