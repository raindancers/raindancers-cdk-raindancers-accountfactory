const { awscdk } = require('projen');
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'Andrew Frazer',
  authorAddress: 'andrew.frazer@raindancers.cloud',
  cdkVersion: '2.28.1',
  defaultReleaseBranch: 'main',
  name: 'account-factory',
  repositoryUrl: 'https://github.com/raindancers/raindancers-cdk-raindancers-accountfactory.git',

  deps: ['aws-cdk-lib'],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
  publishToPypi: {
    distName: 'raindancers-cdk/raindancers-accountfactory',
    module: 'AccountFactory',
  },

});
project.synth();