const TimerView = function() {
  const self = {}

  self.timerModel = null

  self.start = () => {
    self.timerModel.start()
    self.render()
  }

  self.stop = () => {
    // self, this, etc
    self.timerModel.stop()
    self.render()
  }
}
