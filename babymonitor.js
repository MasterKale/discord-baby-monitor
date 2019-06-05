require('dotenv').config();

const fs = require('fs');
const Discord = require('discord.js');

const commandFolder = './commands';
const prefix = process.env.BOT_PREFIX;

const client = new Discord.Client();
client.commands = new Discord.Collection();

// Grab all command files in commands/
const commandFiles = fs.readdirSync(commandFolder).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const commandPath = `${commandFolder}/${file}`;

  const command = require(commandPath);

  client.commands.set(command.name, command);

  console.log(`loaded command ${command.name} (${commandPath})`);
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {
  if (!message.content.startsWith(prefix) || message.author.bot || !message.guild) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'bmonitor') {
    client.commands.get('bmonitor').execute(message);
  } else if (command === 'bstop') {
    client.commands.get('bstop').execute(message);
  }
});

client.login(process.env.BOT_TOKEN);
