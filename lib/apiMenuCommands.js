var apiMenuFetcher = require(__dirname + '/apiMenuFetcher.js');
var rndMessages = require(__dirname + '/randomMessages.js');

var ATTACHMENT_COLOR = '#72AC50';

function onApiCommand(bot, message) {
    console.log('message', message);

    var command = message.command;
    if (command.indexOf('/api') === 0) {
        fetchMenu(bot, message);
    }
}

function fetchMenu(bot, message) {
    return apiMenuFetcher.getMenu()
        .then(function (menu) {
            console.log('Menu fetched');
            sendMenu(bot, message, menu);
        })
        .fin(function() {
        });
}

function sendMenu(bot, message, menu) {
    var menuFormatted = {
        text: menu
    };
    addRandomMessage(message.user_name, menuFormatted);

    if (isPrivateCommand(message)) {
        console.log('Reply private...');
        bot.replyPrivate(message, menuFormatted);
    } else {
        console.log('Reply in public...');
        bot.replyPublic(message, menuFormatted);
    }
}

function isPrivateCommand(message) {
    return message.command.indexOf('private') > 0;
}

function addRandomMessage(userName, menuFormatted) {
    var randomMessage = rndMessages.getRandomMessage(userName);
    if (randomMessage) {
        menuFormatted.attachments = [
            {
                text: randomMessage,
                color: ATTACHMENT_COLOR
            }
        ];
    }
}

module.exports = {
    onApiCommand: onApiCommand
};
