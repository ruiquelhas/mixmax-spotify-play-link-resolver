# mixmax-spotify-play-link-resolver

Embed a Spotify player in your emails.

## Install

```bash
$ npm i ruiquelhas/mixmax-spotify-play-link-resolver
```

## Run

Follow the instructions [here](http://sdk.mixmax.com/docs/tutorial-giphy-link-preview) and replace the hostname with one provided when you run the following command:

```bash
$ ./node_modules/.bin/mixmax-spotify-play
```

If you want TLS support, make sure you have a valid certificate that matches the hostname.

```bash
$ ./node_modules/.bin/mixmax-spotify-play -k <tls_key_path> -c <tls_certificate_path>
```

The regular expression should also match a valid Spotify track link, such as:

```
open.spotify.com/track/[^\/]+-[^\/]+$
```
