# Rose - ApiAuchan Bot

This is a simple bot which fetches and sends menus for the api restaurant.

The bot uses [Botkit](http://howdy.ai/botkit), a great library to handle `slash_commands` and other stuff related to slack.

The bot can handle two commands:

- `api`: sends the menu in the channel
- `apiprivate`: sends the menu only to you

Custom users messages can be filled through the `lib/randomMessages.js` file :)

The api menu is retrieved from the endpoint https://apiauchan-menus.herokuapp.com/apiauchan/menus.

This project was cloned from https://github.com/howdyai/botkit.
