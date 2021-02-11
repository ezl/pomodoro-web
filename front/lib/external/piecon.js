//
// piecon.js
//
// https://github.com/lipka/piecon
//
// Copyright (c) 2015 Lukas Lipka <lukaslipka@gmail.com>. All rights reserved.
//

const Piecon = {}

let currentFavicon = null
let originalFavicon = null
let originalTitle = document.title
let canvas = null
let options = {}
const defaults = {
  color: '#ff0084',
  background: '#bbb',
  shadow: '#fff',
  fallback: false
}

const isRetina = window.devicePixelRatio > 1

const getFaviconTag = function() {
  const links = document.getElementsByTagName('link')

  for (let i = 0, l = links.length; i < l; i++) {
    if (
      links[i].getAttribute('rel') === 'icon' ||
      links[i].getAttribute('rel') === 'shortcut icon'
    ) {
      return links[i]
    }
  }

  return false
}

const removeFaviconTag = function() {
  const links = Array.prototype.slice.call(
    document.getElementsByTagName('link'),
    0
  )
  const head = document.getElementsByTagName('head')[0]

  for (let i = 0, l = links.length; i < l; i++) {
    if (
      links[i].getAttribute('rel') === 'icon' ||
      links[i].getAttribute('rel') === 'shortcut icon'
    ) {
      head.removeChild(links[i])
    }
  }
}

const setFaviconTag = function(url) {
  removeFaviconTag()

  const link = document.createElement('link')
  link.type = 'image/x-icon'
  link.rel = 'icon'
  link.href = url

  document.getElementsByTagName('head')[0].appendChild(link)
}

const getCanvas = function() {
  if (!canvas) {
    canvas = document.createElement('canvas')
    if (isRetina) {
      canvas.width = 32
      canvas.height = 32
    } else {
      canvas.width = 16
      canvas.height = 16
    }
  }

  return canvas
}

const drawFavicon = function(percentage) {
  const canvas = getCanvas()
  const context = canvas.getContext('2d')

  percentage = percentage || 0

  if (context) {
    context.clearRect(0, 0, canvas.width, canvas.height)

    // Draw shadow
    context.beginPath()
    context.moveTo(canvas.width / 2, canvas.height / 2)
    context.arc(
      canvas.width / 2,
      canvas.height / 2,
      Math.min(canvas.width / 2, canvas.height / 2),
      0,
      Math.PI * 2,
      false
    )
    context.fillStyle = options.shadow
    context.fill()

    // Draw background
    context.beginPath()
    context.moveTo(canvas.width / 2, canvas.height / 2)
    context.arc(
      canvas.width / 2,
      canvas.height / 2,
      Math.min(canvas.width / 2, canvas.height / 2) - 2,
      0,
      Math.PI * 2,
      false
    )
    context.fillStyle = options.background
    context.fill()

    // Draw pie
    if (percentage > 0) {
      context.beginPath()
      context.moveTo(canvas.width / 2, canvas.height / 2)
      context.arc(
        canvas.width / 2,
        canvas.height / 2,
        Math.min(canvas.width / 2, canvas.height / 2) - 2,
        -0.5 * Math.PI,
        (-0.5 + (2 * percentage) / 100) * Math.PI,
        false
      )
      context.lineTo(canvas.width / 2, canvas.height / 2)
      context.fillStyle = options.color
      context.fill()
    }

    setFaviconTag(canvas.toDataURL())
  }
}

const updateTitle = function(value) {
  document.title = value + ' ' + originalTitle
}
Piecon.updateTitle = updateTitle

Piecon.setOptions = function(custom) {
  options = {}

  for (const key in defaults) {
    // eslint-disable-next-line
    options[key] = custom.hasOwnProperty(key) ? custom[key] : defaults[key]
  }

  return this
}

Piecon.setProgress = function(percentage) {
  if (!originalTitle) {
    originalTitle = document.title
  }

  if (!originalFavicon || !currentFavicon) {
    const tag = getFaviconTag()
    originalFavicon = currentFavicon = tag
      ? tag.getAttribute('href')
      : '/favicon.ico'
  }

  if (!isNaN(parseFloat(percentage)) && isFinite(percentage)) {
    return drawFavicon(percentage)
  }

  return false
}

Piecon.reset = function() {
  if (originalTitle) {
    document.title = originalTitle
  }

  if (originalFavicon) {
    currentFavicon = originalFavicon
    setFaviconTag(currentFavicon)
  }
}

Piecon.setOptions(defaults)

export default Piecon
