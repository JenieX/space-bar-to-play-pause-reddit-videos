// ==UserScript==
// @name           Space Bar to play/pause Reddit Videos [DEV]
// @namespace      https://github.com/FlowerForWar/space-bar-to-play-pause-reddit-videos
// @description    Play/Pause a focused video by pressing the [Space Bar]. Automatically focus an auto-playing video
// @version        0.07
// @author         FlowrForWar
// @match          https://www.reddit.com/*
// @match          https://old.reddit.com/*
// @grant          GM_xmlhttpRequest
// @noframes
// @compatible     edge Tampermonkey or Violentmonkey
// @compatible     firefox Greasemonkey, Tampermonkey or Violentmonkey
// @compatible     chrome Tampermonkey or Violentmonkey
// @compatible     opera Tampermonkey or Violentmonkey
// @supportURL     https://github.com/FlowerForWar/space-bar-to-play-pause-reddit-videos/issues
// @license        MIT
// ==/UserScript==

GM_xmlhttpRequest({
  url: 'http://192.168.1.39:3905/user-script-grunt?folder=space-bar-to-play-pause-reddit-videos&_=.js',
  // eslint-disable-next-line no-eval
  onload: ({ responseText }) => eval(responseText),
});
