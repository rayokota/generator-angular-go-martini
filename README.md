# The Angular-Sinatra generator 

A [Yeoman](http://yeoman.io) generator for [AngularJS](http://angularjs.org) and [Sinatra](http://www.sinatrarb.com/).

Sinatra is a Ruby-based micro-framework.  For AngularJS integration with a Java-based micro-framework, see the [Angular-Dropwizard generator](https://github.com/rayokota/generator-angular-dropwizard).

## Installation

Install [Git](http://git-scm.com), [node.js](http://nodejs.org), and [Ruby](https://www.ruby-lang.org/).  The development mode also requires [SQLite](http://www.sqlite.org).

Install Yeoman:

    npm install -g yo

Install the Angular-Sinatra generator:

    npm install -g generator-angular-sinatra

## Creating a Sinatra service

In a new directory, generate the service:

    yo angular-sinatra

Run the service:

    rackup

Your service will run at [http://localhost:9292](http://localhost:9292).


## Creating a persistent entity

Generate the entity:

    yo angular-sinatra:entity [myentity]

You will be asked to specify attributes for the entity, where each attribute has the following:

- a name
- a type (String, Integer, Float, Boolean, Date, Enum)
- for a String attribute, an optional minimum and maximum length
- for a numeric attribute, an optional minimum and maximum value
- for a Date attribute, an optional constraint to either past values or future values
- for an Enum attribute, a list of enumerated values
- whether the attribute is required

Files that are regenerated will appear as conflicts.  Allow the generator to overwrite these files as long as no custom changes have been made.

Run the service:

    rackup
    
A client-side AngularJS application will now be available by running

	grunt server
	
The Grunt server will run at [http://localhost:9000](http://localhost:9000).  It will proxy REST requests to the Sinatra service running at [http://localhost:9292](http://localhost:9292).

At this point you should be able to navigate to a page to manage your persistent entities.  

The Grunt server supports hot reloading of client-side HTML/CSS/Javascript file changes.

