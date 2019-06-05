const spawn = require('child_process').spawn;

const numChannels = '2';
const targetSampleRate = '48000'; // Hz

/**
 * Grab a stream of data from the system's default microphone
 *
 * @returns {Stream} - Readable Stream (stdout)
 */
const getDefaultMicrophoneStream = () => {
  let toReturn;

  if (process.platform === 'linux') {
    // Linux: Install `alsa-utils` w/apt(?)
    const arecordOpts = [
      '-c', numChannels,
      '-r', targetSampleRate,
      '-f', 'S16_LE', // little endian 16 bit
      '--buffer-size=16384'
    ];

    // Enable specifying a device ID via .env file
    if (process.env.ARECORD_DEVICE_ID) {
      arecordOpts.push(
        '-D', process.env.ARECORD_DEVICE_ID,
      );
    }

    console.log('arecord options:', arecordOpts);

    toReturn = spawn('arecord', arecordOpts);
  } else if (process.platform === 'darwin') {
    // macOS: Install http://sox.sourceforge.net w/`brew install sox`
    toReturn = spawn('rec', [ // see
      '-c', numChannels,
      '-r', targetSampleRate,
      '-q', // don't show stats
      '-t', 'raw', // record as PCM
      '-b', '16', // little endian 16 bit
      '-' // write audio to stdout
    ]);
  } else {
    throw new Error(`${process.platform} is not a supported platform`);
  }

  return toReturn.stdout;
};

module.exports = {
  getDefaultMicrophoneStream,
};
