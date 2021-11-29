# Trender
Shows monthly trends on Spotify when using monthly playlists

# Development
Instructions on setting up the Trender Server can be found [here](https://github.com/va-rau-jo/Trender-Server).

Assuming you have the Trender Server correctly set up, navigate to this folder and run:

`npm install` and `npm start` to run the client locally.

By default, the client runs on localhost:3000, and redirects to the server to retrieve an access token from Spotify (localhost:8888).

# Deployment

## Heroku

On the command line:

~~~
heroku login

git push heroku master
~~~



## Using Github Pages

Github pages has weird problems with the BrowserRouter that I used to handle navigation on this React app. [This](https://github.com/rafgraph/spa-github-pages) supposedly solves the problem, but I couldn't get it to work.

1. Set the homepage variable in `package.json` -> "homepage": "https://myusername.github.io/my-app"
2. Install github pages -> `npm install --save gh-pages`
3. Set the `predeploy` and `deploy` fields in package.json
 ~~~
 "scripts": {
  + "predeploy": "npm run build",
  + "deploy": "gh-pages deploy -d build",
    "start": "react-scripts start",
    "build": "react-scripts build",
 ~~~
  - I've set the deploy branch to be `deploy` as it will override the contents of your master branch if you use master
  
4. Deploy the site with `npm run deploy`


