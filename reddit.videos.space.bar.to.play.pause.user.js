// ==UserScript==
// @name           Reddit Videos - [Space Bar] to Play/Pause
// @namespace      https://github.com/FlowerForWar/Reddit-Videos-Space-Bar-to-Play-Pause
// @description    Play/Pause a focused video by pressing the [Space Bar]
// @version        0.04
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

async function keydown(event) {
	const { code: key, shiftKey } = event;
	if (key !== 'Space' && key !== 'ArrowLeft' && key !== 'ArrowRight') return;
	if (!(document.activeElement && document.activeElement.id.startsWith('t3_')) && !fullscreenElement) return;
	const video = fullscreenElement ? fullscreenElement.querySelector(':scope > video') : document.activeElement.getElementsByTagName('video')[0];
	if (!video) return;
	event.preventDefault();
	switch (key) {
		case 'Space':
			if (shiftKey) {
				video.currentTime = 0;
				video.play();
			} else if (video.paused) video.play();
			else video.pause();
			break;
		case 'ArrowLeft':
			video.currentTime -= shiftKey ? 10 : 2;
			break;
		case 'ArrowRight':
			video.currentTime += shiftKey ? 10 : 2;
			break;
	}
	video.dispatchEvent(new MouseEvent('mousemove', { bubbles: !0 }));
}
