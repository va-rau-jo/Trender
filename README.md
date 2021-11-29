# Trender
Shows monthly trends on Spotify when using monthly playlists

# Development
Assuming you have the Trender Server correctly set up, navigate to this folder and run:

`npm install` and `npm start` to run the client locally.

By default, the client runs on localhost:3000, and redirects to the server to retrieve an access token from Spotify (localhost:8888).

# Deployment

## Using Github Pages

1. Set the homepage variable in `package.json` -> "homepage": "https://myusername.github.io/my-app"
2. Install github pages -> `npm install --save gh-pages`
3. Set the `predeploy` and `deploy` fiels in package.json
 ~~~
 "scripts": {
  + "predeploy": "npm run build",
  + "deploy": "gh-pages deploy -d build",
    "start": "react-scripts start",
    "build": "react-scripts build",
 ~~~
  - I've set the deploy branch to be `deploy` as it will override the contents of your master branch if you use master
  
4. Deploy the site with `npm run deploy`

5. 


