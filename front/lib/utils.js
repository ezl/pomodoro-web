function isNullOrWhitespace(input) {
  return !input || input.replace(/\s/g, '').length < 1
}

export { isNullOrWhitespace }
