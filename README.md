# Ranker Frontend Client

## What is this?

This is a frontend client for [my ranking backend](https://github.com/ShadiestGoat/rankingBackend). It is for competative 1v1 matches. It works using [ELO](https://en.wikipedia.org/wiki/Elo_rating_system). 

## Setup

To run, this project has 3 env variables to configure. A `.env` file isn't available.

First of all, only 1 is required\*. That one is `ELO_K`. This should be set to be consistent with your server. While it's required, there is a default of 50, just like the server has.

The other available env variables are `API_PROTCOL`, which should be set as "http" or "https". The final one is `API_BASE_ORIGIN`. It's the host of the server. Eg. `localhost:3000` or `shadygoat.eu`. If you are running this [as recommended](#running), you can ignore these, since the api requests would default to `/...`, and they are on the origin so it'll be ok.

First install dependencies, `npm i -D`

## Running

There are 2 options for running this - running it with the API on the same origin, or... not.

To run on the same origin, which is the recommended way, do the setup, then `ELO_K="YourValueHere" npm run build`. After that, move the build folder into `/path/to/server/frontend`. This means that in the server working dir, there should be a `.env` file & a `frontend` folder. The `frontend` folder will have an `index.html` file at the very root of it. 

With the other option, you have to `ELO_K="YourValue" API_PROTCOL="http or https" API_BASE_ORIGIN="yourdomain.com" npm run build`. Then host using whatever (nginx, serve, etc)
