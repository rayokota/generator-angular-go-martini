'use strict';
var util = require('util'),
    yeoman = require('yeoman-generator'),
    fs = require('fs'),
    _ = require('lodash'),
    _s = require('underscore.string'),
    pluralize = require('pluralize');

var EntityGenerator = module.exports = function EntityGenerator(args, options, config) {
  // By calling `NamedBase` here, we get the argument to the subgenerator call
  // as `this.name`.
  yeoman.generators.NamedBase.apply(this, arguments);

  console.log('You called the entity subgenerator with the argument ' + this.name + '.');

  fs.readFile('generator.json', 'utf8', function (err, data) {
    if (err) {
      console.log('Error: ' + err);
      return;
    }
    this.generatorConfig = JSON.parse(data);
  }.bind(this));
};

util.inherits(EntityGenerator, yeoman.generators.NamedBase);

EntityGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  console.log('\nPlease specify an attribute:');

  var prompts = [{
    type: 'input',
    name: 'attrName',
    message: 'What is the name of the attribute?',
    default: 'myattr'
  },
  {
    type: 'list',
    name: 'attrType',
    message: 'What is the type of the attribute?',
    choices: ['String', 'Integer', 'Float', 'Boolean', 'Date', 'Enum'],
    default: 'String'
  },
  {
    when: function (props) { return (/String/).test(props.attrType); },
    type: 'input',
    name: 'minLength',
    message: 'Enter the minimum length for the String attribute, or hit enter:',
    validate: function (input) {
      if (input && isNaN(input)) {
        return "Please enter a number.";
      }
      return true;
    }
  },
  {
    when: function (props) { return (/String/).test(props.attrType); },
    type: 'input',
    name: 'maxLength',
    message: 'Enter the maximum length for the String attribute, or hit enter:',
    validate: function (input) {
      if (input && isNaN(input)) {
        return "Please enter a number.";
      }
      return true;
    }
  },
  {
    when: function (props) { return (/Integer|Float/).test(props.attrType); },
    type: 'input',
    name: 'min',
    message: 'Enter the minimum value for the numeric attribute, or hit enter:',
    validate: function (input) {
      if (input && isNaN(input)) {
        return "Please enter a number.";
      }
      return true;
    }
  },
  {
    when: function (props) { return (/Integer|Float/).test(props.attrType); },
    type: 'input',
    name: 'max',
    message: 'Enter the maximum value for the numeric attribute, or hit enter:',
    validate: function (input) {
      if (input && isNaN(input)) {
        return "Please enter a number.";
      }
      return true;
    }
  },
  {
    when: function (props) { return (/Date/).test(props.attrType); },
    type: 'list',
    name: 'dateConstraint',
    message: 'Constrain the date as follows:',
    choices: ['None', 'Past dates only', 'Future dates only'],
    filter: function (input) {
      if (/Past/.test(input)) return 'Past';
      if (/Future/.test(input)) return 'Future';
      return '';
    },
    default: 'None'
  },
  {
    when: function (props) { return (/Enum/).test(props.attrType); },
    type: 'input',
    name: 'enumValues',
    message: 'Enter an enumeration of values, separated by commas'
  },
  {
    type: 'confirm',
    name: 'required',
    message: 'Is the attribute required to have a value?',
    default: true
  },
  {
    type: 'confirm',
    name: 'again',
    message: 'Would you like to enter another attribute or reenter a previous attribute?',
    default: true
  }];

  this.prompt(prompts, function (props) {
    this.attrs = this.attrs || [];
    var attrType = props.attrType;
    var attrImplType = props.attrType;
    if (attrType === 'String') {
      attrImplType = 'string';
    } else if (attrType === 'Integer') {
      attrImplType = 'int64';
    } else if (attrType === 'Float') {
      attrImplType = 'float64';
    } else if (attrType === 'Boolean') {
      attrImplType = 'bool';
    } else if (attrType === 'Date') {
      attrImplType = 'JDate';
    } else if (attrType === 'Enum') {
      attrImplType = 'enum';
    }
    this.attrs = _.reject(this.attrs, function (attr) { return attr.attrName === props.attrName; });
    this.attrs.push({ 
      attrName: props.attrName, 
      attrType: attrType, 
      attrImplType: attrImplType, 
      minLength: props.minLength,
      maxLength: props.maxLength,
      min: props.min,
      max: props.max,
      dateConstraint: props.dateConstraint,
      enumValues: props.enumValues ? props.enumValues.split(',') : [],
      required: props.required 
    });

    if (props.again) {
      this.askFor();
    } else {
      cb();
    }
  }.bind(this));
};

EntityGenerator.prototype.files = function files() {

  this.baseName = this.generatorConfig.baseName;
  this.packageName = this.generatorConfig.packageName;
  this.entities = this.generatorConfig.entities;
  this.entities = _.reject(this.entities, function (entity) { return entity.name === this.name; }.bind(this));
  this.entities.push({ name: this.name, attrs: this.attrs});
  this.pluralize = pluralize;
  this.generatorConfig.entities = this.entities;
  this.generatorConfigStr = JSON.stringify(this.generatorConfig, null, '\t');

  this.template('_generator.json', 'generator.json');
  this.template('../../app/templates/_server.go', 'server.go');
  this.template('../../app/templates/models/_gorp.go', 'models/gorp.go');
  this.template('models/_entity.go', 'models/' + this.name + '.go');
  this.template('routes/_entities.go', 'routes/' + pluralize(this.name) + '.go');

  var publicDir = 'public/';
  var publicCssDir = publicDir + 'css/';
  var publicJsDir = publicDir + 'js/';
  var publicViewDir = publicDir + 'views/';
  var publicEntityJsDir = publicJsDir + this.name + '/';
  var publicEntityViewDir = publicViewDir + this.name + '/';
  this.mkdir(publicEntityJsDir);
  this.mkdir(publicEntityViewDir);
  this.template('../../app/templates/public/_index.html', publicDir + 'index.html');
  this.template('public/js/entity/_entity-controller.js', publicEntityJsDir + this.name + '-controller.js');
  this.template('public/js/entity/_entity-router.js', publicEntityJsDir + this.name + '-router.js');
  this.template('public/js/entity/_entity-service.js', publicEntityJsDir + this.name + '-service.js');
  this.template('public/views/entity/_entities.html', publicEntityViewDir + pluralize(this.name) + '.html');
};
