# Instagram visualisation

A visualisation of picture colours based on location. Main libraries used are d3 and google maps api.

## Latest build
The latest build of the project is in the dist folder. Needs to be loaded from a server (any server will do) to load the data files properly (due to cross origin request being blocked).

## Compiling and running the project

Uses node and bower package managers to install libraries and run a server to serve the data files.

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
The colour extraction can be found in the lib folder. The main visualisation website source code is in the app folder. Different versions of the data files can be found in the data folder. The data file thats used for the program is in app/data.
