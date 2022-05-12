// ==UserScript==
// @name           Reddit Videos - [Space Bar] to Play/Pause
// @namespace      https://github.com/FlowerForWar/Reddit-Videos-Space-Bar-to-Play-Pause
// @description    Play/Pause a focused video by pressing the [Space Bar]
// @version        0.02
// @author         FlowrForWar
// @match          https://www.reddit.com/r/*
// @grant          none
// @supportURL     https://github.com/FlowerForWar/Reddit-Videos-Space-Bar-to-Play-Pause/issues
// @license        MIT
// ==/UserScript==

let fullscreenElement;
document.documentElement.addEventListener('fullscreenchange', () => {
	const fullscreen_had_video = !!fullscreenElement && !!fullscreenElement.querySelector(':scope > video');
	if (fullscreen_had_video) fullscreenElement.closest('[id^="t3_"]').focus();
	fullscreenElement = document.fullscreenElement;
});
window.addEventListener('keydown', keydown);

function keydown(event) {
	if (event.code !== 'Space') return;
	if (!(document.activeElement && document.activeElement.id.startsWith('t3_')) && !fullscreenElement) return;
	const video = fullscreenElement ? fullscreenElement.querySelector(':scope > video') : document.activeElement.getElementsByTagName('video')[0];
	if (!video) return;
	event.preventDefault();
	if (video.paused) video.play();
	else video.pause();
}
