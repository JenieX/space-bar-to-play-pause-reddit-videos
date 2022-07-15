// ==UserScript==
// @name           Space Bar to play/pause Reddit Videos
// @namespace      https://github.com/FlowerForWar/space-bar-to-play-pause-reddit-videos
// @description    Play/Pause a focused video by pressing the [Space Bar]. Automatically focus an auto-playing video
// @version        0.07
// @author         FlowrForWar
// @match          https://www.reddit.com/*
// @match          https://old.reddit.com/*
// @grant          none
// @noframes
// @compatible     edge Tampermonkey or Violentmonkey
// @compatible     firefox Greasemonkey, Tampermonkey or Violentmonkey
// @compatible     chrome Tampermonkey or Violentmonkey
// @compatible     opera Tampermonkey or Violentmonkey
// @supportURL     https://github.com/FlowerForWar/space-bar-to-play-pause-reddit-videos/issues
// @license        MIT
// ==/UserScript==

/**
 *  ## Some notes on how it works
 *   - Video losing focus, means the default behavior of Space Bar is activated, that is scrolling down
 *   - Video loses focus in these situations
 *     - When the video is finished playing
 *     - When the video is auto-paused by scrolling down
 *     - When the video is paused by click and this script has been triggerd at least once on that video
 */

/**
 * In case someone is using the old layout by default, we will check for the header
 * element, that is only present in the old Reddit layout.
 */
const oldReddit = window.location.host === 'old.reddit.com' || !!document.querySelector('#header');
// alert(`oldReddit: ${!!document.getElementById('header')}`);

let fullscreenElement;
let pausedByScript;
let controlsHideTimer;
document.documentElement.addEventListener('fullscreenchange', () => {
  const fullscreenHadVideo =
    !!fullscreenElement && !!fullscreenElement.querySelector(':scope > video');
  if (fullscreenHadVideo) fullscreenElement.closest('[id*="t3_"]').focus();
  fullscreenElement = document.fullscreenElement;
});

// https://stackoverflow.com/a/31133401
Object.defineProperty(HTMLMediaElement.prototype, 'playing', {
  get() {
    return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
  },
});

function pause() {
  if (pausedByScript) return;
  document.activeElement.blur();
  // this.removeEventListener('pause', pause);
}

function play() {
  /**
   * Clear the variable
   */
  pausedByScript = null;
  // this.removeEventListener('play', play);
}

// eslint-disable-next-line no-unused-vars
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function getT3Element(video) {
  return video.closest('[id*="t3_"]');
}

async function keydownHandler(event) {
  const { code: key, shiftKey } = event;
  if (key !== 'Space' && key !== 'ArrowLeft' && key !== 'ArrowRight') return;

  const allVideos = [...document.getElementsByTagName('video')];

  /**
   * Getting the first video that is being played.
   */
  const playingVideo = allVideos.filter((video) => video.playing)[0];

  /**
   * Focusing the video that is being played, if there is one.
   */
  if (playingVideo) {
    const t3Element = getT3Element(playingVideo);

    /**
     * Setting the `tabindex` attribute to `'-1'` seems to be needed on
     * an element, that wants to be available as `document.activeElement` when focused.
     */
    t3Element.setAttribute('tabindex', '-1');
    t3Element.focus();
  }

  if (
    !(document.activeElement && document.activeElement.id.includes('t3_')) &&
    !fullscreenElement
  ) {
    // alert('No focused video');
    return;
  }

  const video = fullscreenElement
    ? fullscreenElement.querySelector(':scope > video')
    : document.activeElement.getElementsByTagName('video')[0];
  if (!video) return;

  event.preventDefault();
  // eslint-disable-next-line default-case
  switch (key) {
    //
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
    //
    case 'ArrowLeft':
      video.currentTime -= shiftKey ? 10 : 2;
      break;
    //
    case 'ArrowRight':
      video.currentTime += shiftKey ? 10 : 2;
      break;
    //
  }
  video.addEventListener('pause', pause);
  video.addEventListener('play', play);

  /**
   * Next, is to simulate a mouse move on the video, in order to show the player controls.
   * However, old Reddit layout seems to have an issue with this method, so we show and hide the controls manually
   */
  if (oldReddit) {
    const controlsElement = getT3Element(video).querySelector('.playback-controls');
    const itsOpacity = controlsElement.style.getPropertyValue('opacity');

    /**
     * If the controls element is hidden, we show it
     */
    if (itsOpacity === '0') {
      controlsElement.style.setProperty('opacity', '1');
    }

    /**
     * Resets the old `hide controls element` timer, that is created by the previous
     * key (Space, ArrowLeft, or ArrowRight), and create a new one
     */
    clearTimeout(controlsHideTimer);
    controlsHideTimer = setTimeout(() => {
      controlsElement.style.setProperty('opacity', '0');
    }, 2500);
    //
  } else {
    video.dispatchEvent(new MouseEvent('mousemove', { bubbles: !0 }));
  }
}

window.addEventListener('keydown', keydownHandler);
