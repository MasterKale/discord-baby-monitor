const { disconnectFromCurrentVoiceChannel } = require('../helpers/disconnect');

module.exports = {
  name: 'bstop',
  description: 'Tell BabyMonitor to leave your voice channel',
  execute(message) {
    disconnectFromCurrentVoiceChannel(message);
  }
};
