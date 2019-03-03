require('./libs/modernizr.min.js');

const _ = require('lodash');
const Slideout = require('slideout');
const attachFastClick = require('fastclick');
const util = require('./util');

attachFastClick(document.body);

function main() {
  const slideout = initSlideout();
  slideout.on('translatestart', () => examples.pause());
  slideout.on('translateend', () => examples.resume());
}

function initSlideout() {
  var slideout = new Slideout({
    menu: document.getElementById('side-menu'),
    panel: document.getElementById('content-wrapper'),
    padding: 256,
    tolerance: 100
  });

  const hamburgerButton = document.querySelector('.side-menu-toggle');
  const throttledToggle = _.throttle(slideout.toggle.bind(slideout), 600);
  hamburgerButton.addEventListener('click', throttledToggle);

  const topBar = document.querySelector('#top-bar');
  slideout.on('beforeopen', () => {
    util.addClass(hamburgerButton, 'is-active')
  });

  slideout.on('beforeclose', () => {
    util.removeClass(hamburgerButton, 'is-active')
  });

  var children = document.querySelector('#shape-links').children;
  for (var i = 0; i < children.length; ++i) {
    var liEl = children[i];
    liEl.addEventListener('click', () => slideout.close());
  }

  return slideout;
}

main()
