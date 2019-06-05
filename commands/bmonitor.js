const { getDefaultMicrophoneStream } = require('../helpers/microphone');
const { disconnectFromCurrentVoiceChannel } = require('../helpers/disconnect');

module.exports = {
  name: 'bmonitor',
  description: 'Tell BabyMonitor to join your current voice channel',
  async execute(message) {
    const {
      member,
      client
    } = message;

    if (member.voiceChannel) {
      // `connection` should be an instance of VoiceConnection
      let connection;

      try {
        console.log('joining member\'s voice channel');
        connection = await member.voiceChannel.join();
      } catch (err) {
        console.error(err);
        return;
      }

      console.log('grabbing microphone stream');
      const micStream = getDefaultMicrophoneStream();

      console.log('playing microphone stream through bot')
      const dispatch = connection.playConvertedStream(micStream);

      // Destroy the stream when the bot leaves the channel
      dispatch.on('end', () => {
        console.log('stream ended. destroying microphone stream');
        micStream.destroy();
      });

      client.on('voiceStateUpdate', async (oldMember, newMember) => {
        if (member.id === newMember.id) {
          if (!newMember.voiceChannelID) {
            console.log('monitor user left voice channel. disconnecting');
            disconnectFromCurrentVoiceChannel(message);
          }
        }
      });
    } else {
      message.reply('you need to join a voice channel first!');
    }
  }
}
