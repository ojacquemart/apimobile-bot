/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ROSE BOT
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

if (!process.env.token) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}

var Botkit = require('./lib/Botkit.js');
var os = require('os');
var request = require('request');
var Q = require('q');

var controller = Botkit.slackbot({
    debug: true
});

var bot = controller.spawn({
    token: process.env.token
}).startRTM();

controller.hears(['hello', 'hi'], 'direct_message,direct_mention,mention', function (bot, message) {

    bot.api.reactions.add({
        timestamp: message.ts,
        channel: message.channel,
        name: 'robot_face',
    }, function (err, res) {
        if (err) {
            bot.botkit.log('Failed to add emoji reaction :(', err);
        }
    });


    controller.storage.users.get(message.user, function (err, user) {
        if (user && user.name) {
            bot.reply(message, 'Hello ' + user.name + '!!');
        } else {
            bot.reply(message, 'Hello.');
        }
    });
});

controller.hears(['call me (.*)'], 'direct_message,direct_mention,mention', function (bot, message) {
    var matches = message.text.match(/call me (.*)/i);
    var name = matches[1];
    controller.storage.users.get(message.user, function (err, user) {
        if (!user) {
            user = {
                id: message.user,
            };
        }
        user.name = name;
        controller.storage.users.save(user, function (err, id) {
            bot.reply(message, 'Got it. I will call you ' + user.name + ' from now on.');
        });
    });
});

controller.hears(['what is my name', 'who am i'], 'direct_message,direct_mention,mention', function (bot, message) {

    controller.storage.users.get(message.user, function (err, user) {
        if (user && user.name) {
            bot.reply(message, 'Your name is ' + user.name);
        } else {
            bot.reply(message, 'I don\'t know yet!');
        }
    });
});

var port = (process.env.PORT || 5000);

// receive outgoing or slash commands
// if you are already using Express, you can use your own server instance...
controller.setupWebserver(port, function (err, webserver) {

    controller.createWebhookEndpoints(controller.webserver);

});

var SPECIFIC_MESSAGES = {
    'walter_white': [
        'Mollo sur les frites',
        'Easy sur la sauce!',
        'Une grosse assiette!',
        'Beaucoup de frites, t\'as pas l\'air en forme',
        'Bisous',
        'Say my name'
    ],
    'amandine': [
        'Prends du poisson!',
        'Fais nous des cookies',
        'Mange pas trop, pense à la business value',
        '#businesssvalue',
        'Donne ton déssert à ChriChri d\'amour'
    ],
    'lindsay': [
        'Regarde pas les autres manger',
        'Ne prends pas trop de déssert',
        'Oublie pas ta clope sur le plateau',
        'Oublie pas ton sport!',
        'Au rapport'
    ],
    'deborah.g': [
        'Prends de la viande!',
        'Mange de la soupe, il est pas trop tard!',
        'Des coquillettes!',
        'Salut c\'est moi, coquilette',
        'Oublie pas de boire après le repas',
        'Tu me fais un thé spécial digestion difficile?'
    ],
    'christophe': [
        'Oublie pas de prendre deux assiettes!',
        'Finis le plat de Déborah',
        'Les frites, c\'est pas bon pour le régime!',
        'Quick?'
    ],
    'dsk': [
        'Tu me feras une cocotte?',
        'Hey, cowboy',
        'Par l\'intérieur, il pleut',
        'Frite',
        'La frite, c\'est la fête!',
        'Mac Do?'
    ],
    'olivier': [
        '#popopo',
        'Boobs 4 life',
        'Tu te mettrais pas au yoga?'
    ],
    'damien': [
        'Oublie pas ta session agile',
        'Quelle agilité',
        'Les réunions agiles, tu kiffes',
        '#timeboxing'
    ],
    'margolle': [
        'Il faut manger plus',
        'Prends un déssert'
    ]
};

controller.on('slash_command', function (bot, message) {

    console.log('message', message);
    var command = message.command;
    if (command.indexOf('/api') === 0) {
        fetchMenu(bot, message);
    }

});

var MENUS_URL = 'https://apiauchan-menus.herokuapp.com/apiauchan/menus';

function fetchMenu(bot, message) {

    doFetchMenu()
        .then(function (menu) {
            console.log('Menu fetched');
            sendMenu(bot, message, menu);
        })
        .fin(function () {
        });
}

function doFetchMenu() {
    var deferred = Q.defer();

    console.log('Fetch menu', MENUS_URL);
    request(MENUS_URL, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log('Current menu', body);
            return deferred.resolve(body.toString());
        } else {
            console.log(error, response.statusCode);

            return deferred.reject(new Error('Failed to fetch menu...'));
        }
    });

    return deferred.promise;

}

function sendMenu(bot, message, menu) {
    var randomMessage = getRandomMessage(message.user_name) || '';
    var menuWithRandomMessage = {
        text: menu,
        attachments: [
            {
                text: randomMessage,
                color: '#72AC50'
            }
        ]
    };

    if (message.command.indexOf('private') > 0) {
        console.log('Reply private...', menu);
        bot.replyPrivate(message, menuWithRandomMessage);
    } else {
        console.log('Reply in public...');
        bot.replyPublic(message, menuWithRandomMessage);
    }
}

function getRandomMessage(userName) {
    var messages = SPECIFIC_MESSAGES[userName];
    if (!messages) {
        return;
    }

    var randomIndex = getRandomInt(0, messages.length);
    var randomMessage = messages[randomIndex];
    console.log('Generate random message', randomMessage, 'to', userName);

    return randomMessage;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

controller.hears(['shutdown'], 'direct_message,direct_mention,mention', function (bot, message) {

    bot.startConversation(message, function (err, convo) {
        convo.ask('Are you sure you want me to shutdown?', [
            {
                pattern: bot.utterances.yes,
                callback: function (response, convo) {
                    convo.say('Go fuck yourself!');
                    convo.next();
                }
            },
            {
                pattern: bot.utterances.no,
                default: true,
                callback: function (response, convo) {
                    convo.say('*Phew!*');
                    convo.next();
                }
            }
        ]);
    });
});

controller.hears(['uptime', 'identify yourself', 'who are you', 'what is your name'], 'direct_message,direct_mention,mention', function (bot, message) {

    var hostname = os.hostname();
    var uptime = formatUptime(process.uptime());

    bot.reply(message, ':robot_face: I am a bot named <@' + bot.identity.name + '>. I have been running for ' + uptime + ' on ' + hostname + '.');

});

function formatUptime(uptime) {
    var unit = 'second';
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'minute';
    }
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'hour';
    }
    if (uptime != 1) {
        unit = unit + 's';
    }

    uptime = uptime + ' ' + unit;
    return uptime;
}
