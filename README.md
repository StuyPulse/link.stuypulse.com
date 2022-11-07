# link.stuypulse.com
A very simple link shortening tool built on Github Pages.

## How it works
Whenever a user tries to request a html file that doesn't exist in a Github Pages deployment, it gets sent to `404.html`. We can check what the user tried to get with javascript on that page, and see if it exists in `links.json` - and if so, redirect.

## Adding links
All links are stored in `links.json`. To add one, add another entry to it with the short version as they key and the long url as the value.
