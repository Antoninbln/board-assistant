## What's the project ?
Board assistant is a personal project which consists on showing different information on a screen (list non-exaustive) :
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


#### 1. How to launch


##### 1.1 Add config file
Add `.env` file in *root*. Be sure it follows `.env_example` schema.

##### 1.2 Initialize base app
In 2 differents terminals type the following commands :
```
yarn run server
yarn run client
```
Then a new tab opens in your favourite browser. If you don't want to initialize spotify API, don't consider next step.

##### 1.3 Initialize Spotify playback *(optional)*
🚨 *For this part, be sure to have a premium account on Spotify.*

![Splash screen image]("https://github.com/Antoninbln/board-assistant/tree/master/.github/img/login-with-spotify.PNG")
Click *"Login in"* button.

Then you are redirected to the App screen.


#### 2. How to use
Special mention for Spotify users ; yYou'll be able to use some vocal commands, here is the list : 
- `album`: play an album
- `joue`: play a song (with this you can ask **song title**, **singer name** & **album name** all combined in command)
- `pause`: pause current track
- `play`: resume track
- `suivant`: play next track
- `précédent`: play previous track
- `avance`: go forward in the track
- `recule`: go backward in the track
- `*anything`: Everything you say which doesn't trigger a command is displayed on screen, so you have a feedback on what is understood by the application.
- `test`: test state of speech recognition, it arrives that commands are not triggered, or recognition break, so you can test it. 

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