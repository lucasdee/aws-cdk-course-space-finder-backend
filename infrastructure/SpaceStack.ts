import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Code, Function as LambdaFunction, Runtime } from 'aws-cdk-lib/aws-lambda';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

import { join } from 'path';
import { GenericTable } from './GenericTable';

export class SpaceStack extends Stack {
  private api = new RestApi(this, 'SpaceApi');

  private spacesTable = new GenericTable('SpacesTable', 'spaceId', this);

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    // const helloLambda = new LambdaFunction(this, 'helloLambda', {
    //   runtime: Runtime.NODEJS_16_X,
    //   code: Code.fromAsset(join(__dirname, '..', 'services', 'hello')),
    //   handler: 'hello.main',
    // });

    const helloLambdaNodeJs = new NodejsFunction(this, 'helloLambdaNodeJs', {
      entry: join(__dirname, '..', 'services', 'node-lambda', 'hello.ts'),
      handler: 'handler'
    });

    // Hello Api lambda integration:
    const helloLambdaIntegration = new LambdaIntegration(helloLambdaNodeJs);
    const helloLambdaResource = this.api.root.addResource('hello');
    helloLambdaResource.addMethod('GET', helloLambdaIntegration);
  }
}
