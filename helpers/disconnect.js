const disconnectFromCurrentVoiceChannel = (message) => {
  const {
    client,
    guild
  } = message;
  console.log('finding current voice session in guild');
  const currentVoiceSessionInGuild = client.voiceConnections.get(guild.id);

  if (currentVoiceSessionInGuild) {
    const voiceChannel = currentVoiceSessionInGuild.channel;

    console.log(`leaving voice channel ${voiceChannel.name} in guild ${guild.name}`);
    currentVoiceSessionInGuild.disconnect();
  }
};

module.exports = {
  disconnectFromCurrentVoiceChannel,
};
