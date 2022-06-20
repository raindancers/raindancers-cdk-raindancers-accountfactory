import * as cdk from 'aws-cdk-lib'
import * as constructs from 'constructs'
import * as path from 'path'

import {
  custom_resources as cr,
  aws_lambda as lambda,
  aws_logs as logs,
  aws_iam as iam,
}
from 'aws-cdk-lib'

export class NewAccountProps {
  SSOUserEmail: string;
  SSOUserFirstName: string;
  SSOUserLastName: string;
  ManagedOrganizationalUnit: string;
  AccountName: string;
  AccountEmail: string;
}

export class AccountFactory extends constructs.Construct {
  public readonly accountId: string;

  constructor(scope: constructs.Construct, id: string, props: NewAccountProps) {
    super(scope, id);

    const callAccountFactory = new lambda.Function(this, 'CallAccountFactoryLambda', {
      handler: 'oompaloompa.on_event',
      code: lambda.Code.fromAsset(path.join(__dirname, 'lambda'),
        {
          bundling: { 
            image: lambda.Runtime.PYTHON_3_9.bundlingImage,
            command: [
              'bash', '-c',
              'pip install -r requirements.txt -t /asset-output && cp -au . /asset-output'
            ],
          },
        }),
      runtime: lambda.Runtime.PYTHON_3_9,
      //environment: 
    });

    callAccountFactory.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          "servicecatalog:SearchProducts",
          "servicecatalog:DescribeProduct",
          "servicecatalog:ProvisionProduct"
        ],
        resources: ['*']
      })
    )

    const callAccountFactoryCRProvider = new cr.Provider(this, 'CallAccountFactoryCR', {
      onEventHandler: callAccountFactory,
      logRetention: logs.RetentionDays.ONE_YEAR,
    })

    const newAccount = new cdk.CustomResource(this, 'NewAccount', {
      properties: props,
      serviceToken: callAccountFactoryCRProvider.serviceToken
    })

    this.accountId = newAccount.getAtt('AccountID').toString();
   
  }
}