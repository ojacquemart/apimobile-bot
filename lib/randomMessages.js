var USERS_MESSAGES = {
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
  'yohanmassart': [
    'Oublie pas Vincent!',
    'Mets-toi en face de la fontaine, tu verras loin :kiss:'
  ],
  'vincent': [
    'Prends un plateau vegan'
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
  ],
  'francoisg': [
    'Mollo, on MEP après!'
  ]
};

function getRandomMessage(userName) {
  var messages = USERS_MESSAGES[userName];
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

module.exports = {
  getRandomMessage: getRandomMessage
};
