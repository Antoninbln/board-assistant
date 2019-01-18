## What's the project ?
Board assistant is a personal project which consist on showing different information on a screen (list non-exaustive) :
- Bus hours
- Weather
- And it can play spotify songs thanks to vocal recognition

App can be displayed on a browser with a Reaspberry Pi.
**For short term** : Each kind of information is displayed in a component which is a part of the interface, and with vocal recognition you can play a song from Spotify.
**For long term** : Each component should began a view, and vocal recognition should be used for navigation through views. This way you can say "Show me the weather", and weather route should be rendered as view.

## Technologies
- **ReactJS** → [Doc](https://reactjs.org/docs/getting-started.html)
- **Sass** → [Doc](http://sass-lang.com/documentation/file.SASS_REFERENCE.html)
- **Spotify API** → [Doc](https://developer.spotify.com/documentation/web-api/)
- **Annyang** → [Doc](https://www.talater.com/annyang/)

## Installation
#### Step 1

## How to launch
To launch the project :
```
yarn run start  // Dev or Prod
// or
yarn run build  // Production
```
Be sure to have a `.env` file in *root*.

## To contribute
### Pull requests
1. Create your branch
2. Push your work
3. Create your PR
  Be sure to :
    - Name the PR the good way
    - Call issue in decription like : "Close #120"
    - Respect the PR template

### Commits
To commits our work, we use a package named [semantic-git-commit-cli](https://www.npmjs.com/package/semantic-git-commit-cli).<br/>
So you can use `yarn run sgc` to create a commit formalized.

### Issues
If you think about a new feature, or a bug to fix, please leave an issue and follow the template. 

### More informations
#### About the vocal recognition
We use [Annyang API](), based on native browser SpeechRecognition API (only available on Chrome and Firefox).
Thee Doc, it's that it recognizes Noun propers, so we can easily use it to generate requests with artists, albums, tracks names...