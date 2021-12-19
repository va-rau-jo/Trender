# Trender
Shows monthly trends on Spotify when using monthly playlists

# Development
Instructions on setting up the Trender Server can be found [here](https://github.com/va-rau-jo/Trender-Server).

Assuming you have the Trender Server correctly set up, navigate to this folder and run:

`npm install` and `npm start` to run the client locally.

By default, the client runs on localhost:3000, and redirects to the server to retrieve an access token from Spotify (localhost:8888).

# Deployment

## Heroku

Deployment for both Trender and Trender-Server was done by connecting my GitHub master branch to the Heroku app.

Image URLs had to be updated to imports for Heroku to find them.

I also used [Kaffeine](http://kaffeine.herokuapp.com/) to ping both apps so they don't fall asleep.
