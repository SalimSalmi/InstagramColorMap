# instagram-vis - Instagram

A visualisation of picture colours based on location. Main libraries used are d3 and google maps api.

## Compiling and running the project

Uses node and bower package managers to install libraries and run a server to serve the data files.

In the dist folder an already compiled version can be found. Needs to be loaded from a server to load the data files properly (due to cross origin request being blocked).

#### Install the node and bower dependencies
```
npm install
bower install
```

#### Run gulp to
Compile all files and start a webserver on [localhost:8000](http://localhost:8000):
```
gulp
```

## Source code
The colour extraction can be found in the lib folder.
The main visualisation website source code is in the app folder and
