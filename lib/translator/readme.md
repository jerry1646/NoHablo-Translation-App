# NoHablo
=====================


### Screenshots
![alt text](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "Logo Title Text 1")
### Usage

Setup google account:

- In the Google Clour Platform Console, go to the Create service account key page. [link to google account credential ](https://console.cloud.google.com/apis/credentials/serviceaccountkey?_ga=2.104477824.-1895077828.1541163389 "Go to create service account key page")
- From the Service account drop-down list, select New service account.
- In the Service account name field, enter a name .
- From the Role drop-down list, select Project > Owner.

- Note: The Role field authorizes your service account to access resources. You can view and change this field later by using GCP Console. If you are developing a production app, specify more granular permissions than Project > Owner. For more information, see granting roles to service accounts.
- Click Create. A JSON file that contains your key downloads to your computer.
- Set environment varibale which will be used by the google cloud authentification
```
export GOOGLE_APPLICATION_CREDENTIALS="[PATH]"
```
- Replace [PATH] with the file path of the JSON file that contains your service account key

Setup environment: install nvm / node
```
nvm use node 8.9.4
npm install -g npm@5.2.0
````
Install the dependencies for the server-side app and start the server.
```
npm install
```

Install the dependencies for the client-side app and start the server.
```
npm install
npm start
open http://localhost:3000
```

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
(real time specific)
* macOS: brew install sox / Linux: sudo apt-get install sox libsox-fmt-all
*

* @google-cloud/speech
* @google-cloud/translate
* @google-cloud/text-to-speech
* express
* uuid
* ws
