const { awscdk } = require('projen');
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'Andrew Frazer',
  authorAddress: 'andrew.frazer@contactenergy.co.nz',
  cdkVersion: '2.1.0',
  defaultReleaseBranch: 'main',
  name: 'account-factory',
  repositoryUrl: 'https://github.com/andrew.frazer/account-factory.git',

  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
});
project.synth();