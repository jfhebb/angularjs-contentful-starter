/**
 * Node.js script which exports the 'Sample' Contentful space and uploads it into the users specified space.
 * @author Josh Hebb
 */

var prompt = require('prompt');
var spaceImport = require('contentful-import');
var updateJson = require('update-json');

// Contentful Export & Import Options
var options = {
  spaceId: '',
  accessToken: '',
  managementToken: '',
  saveFile: false,
  maxAllowedItems: 100
}

// Package JSON relative path.
var filePath = './package.json';

// Contentful options parameter definitions.
var schema = {
  properties: {
    // Your personal Space ID
    spaceId: {
      required: true
    },
    // Content Delivery Access Token
    accessToken: {
      required: true
    },
    // Content Management Token
    managementToken: {
      required: true
    }
  }
};

// Configuration data that we'll inject into package.json
var data = {
  config: {
    contentfulConfigurations: {
      spaceId: '',
      accessToken: ''
    }
  }
}


prompt.start();
console.log("Starting the Contentful Export & Import Process..");
console.log("Please enter your Contentful Space ID and your Content Delivery / Management Tokens.");
console.log("You can find those values in Contentful under your space.");
console.log("---------------------------------------------------------");

// Get two properties from the user: username and email
prompt.get(schema, function (err, result) {

      var contentfulSpaceExport = require('./contentful-export.json');

      // Update the options with the output JSON from the export and the user input spaceId & management token.
      options.content = contentfulSpaceExport;
      options.spaceId = result.spaceId;
      options.accessToken = result.accessToken;
      options.managementToken = result.managementToken;

      // Import the Space and pass the input into update JSON to update the package.json configs.
      spaceImport(options)
        .then((output) => {
          console.log('Data Imported successfully');

          // Set the JSON values entered by the user to update package.json
          data.config.contentfulConfigurations.spaceId = options.spaceId;
          data.config.contentfulConfigurations.accessToken = options.accessToken;

          // Update package.json
          updateJson(filePath, data, function (error) {
            if (error) {
              console.log("An error occurred updating package.json: " + err);
            }
          });
        })
        .catch((err) => {
          console.log('Something went wrong with the import: ', err)
        });
});
