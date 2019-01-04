NoHablo Audio Translation
=====================
A single-page real-time audio translation web app powered by Google Cloud APIs. This application was developed by [Anael Berrouet](https://github.com/AnaelBerrouet), [Jerry Song](https://github.com/jerry1646) and [Maggie Zhu](https://github.com/maggiezhu) in two weeks as a proof-of-concept prototype.

Designed for lecture/tour/conference settings, this application allows a speaker to create a chat room, deliver a speech, and have his speech translated and broadcasted to all listeners in the chat room.

The speech recognition, translation, and text-to-speech synthesis are processed using Google Cloud APIs. Three API calls are made consecutively for each speech segment, and the response is broadcasted to the audience using WebSockets.

This repository is for development. Webpack dev server is set up to make life easier with front-end work.

### Getting Started

1. Clone this repository.
2. In both project root directory and "./client", run `npm install` command to install dependencies.
3. Set up your own Google Cloud service (instructions below)
4. Configure environment (install nvm / node)
```
nvm use node 8.9.4
npm install -g npm@5.2.0
````
- Note: Specific version of Node is used to ensure compatibility with dependencies
5. In both project root directory and "./client", run `npm start` command and the app will be served at `http://localhost:3000`
- REMEMBER to set the environment variable for your Google Cloud credential before attempting to run the app.


### Set up Google Cloud Account
1. In the Google Cloud Platform Console, go to the [Create Service Account Key](https://console.cloud.google.com/apis/credentials/serviceaccountkey?_ga=2.104477824.-1895077828.1541163389 "Go to create service account key page").
2. From the 'Service account' drop-down list, select 'New service account'.
3. In the 'Service account name' field, enter a name.
4. From the 'Role' drop-down list, select Project => Owner.
- Note: The Role field authorizes your service account to access resources. You can view and change this field later by using GCP Console. If you are developing a production app, specify more granular permissions than Project > Owner. For more information, see granting roles to service accounts.
5. Click Create. A JSON file that contains your key downloads to your computer.
6. Set environment variable which will be used by the Google Cloud Authentification:
```
export GOOGLE_APPLICATION_CREDENTIALS="[PATH]"
```
7. Replace [PATH] with the file path of the JSON file that contains your service account key (see example in './lib/translator/env.example.txt')

### App Walkthrough
- Homepage
![Home Page](https://github.com/jerry1646/NoHablo-Translation-App/blob/master/docs/screenshots/homepage.png)
- Speaker can create a chatroom of his own language. Supported languages are listed [here](https://cloud.google.com/speech-to-text/docs/languages).
![Create Room Page](https://github.com/jerry1646/NoHablo-Translation-App/blob/master/docs/screenshots/Create-Room.png)
- While in the room, the speaker can see his assigned room ID and tell his audience to join in. After clicking on the record button, the speaker can start his voice input. A frequency-based visualizer will show up on the bottom of the page. Upon clicking on the stop button, the speech is sent to the server.
![Speech in Action](https://github.com/jerry1646/NoHablo-Translation-App/blob/master/docs/screenshots/Speech-in-Action.png)
- A listener can join the chatroom via the link on the home page. He/she can select the language that he/she wishes to listen to. Supported languages are listed [here](https://cloud.google.com/text-to-speech/docs/voices).
![Join Room Page](https://github.com/jerry1646/NoHablo-Translation-App/blob/master/docs/screenshots/Join-Room.png)
- While connected, the listener can listen to the translated speech as well as see the original and translated text on the screen.
![Listener Page](https://github.com/jerry1646/NoHablo-Translation-App/blob/master/docs/screenshots/Listener-Screen.png)
- When a new audio message is being played, an animated loading circle will show up on the page as an indication.
![Playing in Action](https://github.com/jerry1646/NoHablo-Translation-App/blob/master/docs/screenshots/Playing-in-Action.png)
- If a user is disconnected from the chatroom, he/she would be notified by the connection indicator and the loading circle
![Lost Connection](https://github.com/jerry1646/NoHablo-Translation-App/blob/master/docs/screenshots/Lost-Connection-Indication.png)

### Challenges
The API calls for each audio segment introduce inevitable latency in user experience. Typically, it would take up to 15 seconds for the listeners to receive translated audio data (assuming an audio input of around 10 seconds) after the real speech.

In order to address this issue, we used asynchronous programming on the server side to process audio data in parallel. When new speech data is received from the speaker, a Task object is instantiated, set to execute, and placed in a task queue (a simple array) that uses the first-in-first-out rule to preserve the order of Task objects. Each Task object handles its own API calls using async/await pattern. Once all API calls respond, the Task object marks itself complete, and wait in the queue for its turn to be broadcasted. As a result, the latency is reduced by up to 40% by observation.

Although the latency is still quite significant by real-time definition, the bottleneck is now with API communication itself. We suspect that hosting this app on GCP may enable the use of better communication technologies such that the latency in data transmission can be further reduced.

### Dependencies

##### Client-side App
* react
* webpack
* [webpack-dev-server](https://github.com/webpack/webpack-dev-server)
* babel
* babel-core
* [babel-loader](https://github.com/babel/babel-loader)
* babel-preset-es2015
* babel-preset-react
* babel-preset-stage-0
* css-loader
* eslint
* eslint-plugin-react
* node-sass
* sockjs-client
* style-loadera

##### Server-side App
* @google-cloud/speech
* @google-cloud/translate
* @google-cloud/text-to-speech
* express
* uuid
* ws