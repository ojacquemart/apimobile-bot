var Q = require('q');
var request = require('request');

var MENUS_URL = 'https://apiauchan-menus.herokuapp.com/apiauchan/menus';

function getMenu() {
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

module.exports = {
    getMenu: getMenu
};
