import { CfnOutput, Fn, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AuthorizationType, LambdaIntegration, MethodOptions, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';

import { join } from 'path';
import { GenericTable } from './GenericTable';

import { AuthorizerWrapper } from './auth/AuthorizerWrapper';
import { Bucket, HttpMethods } from 'aws-cdk-lib/aws-s3';

export class SpaceStack extends Stack {
  private api = new RestApi(this, 'SpaceApi');
  private authorizer: AuthorizerWrapper;
  private suffix: string;
  private spacesPhotoBucket: Bucket;

  private spacesTable = new GenericTable(this, {
    tableName: 'SpacesTable',
    primaryKey: 'spaceId',
    createLambdaPath: 'Create',
    readLambdaPath: 'Read',
    updateLambdaPath: 'Update',
    deleteLambdaPath: 'Delete',
    secondaryIndexes: ['location'],
  });

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    this.authorizer = new AuthorizerWrapper(this, this.api);
    this.initializeSuffix();
    this.initializeSpacesPhotoBucket();

    const helloLambdaNodeJs = new NodejsFunction(this, 'helloLambdaNodeJs', {
      entry: join(__dirname, '..', 'services', 'node-lambda', 'hello.ts'),
      handler: 'handler',
    });

    const s3ListPolicy = new PolicyStatement();
    s3ListPolicy.addActions('s3:ListAllMyBuckets');
    s3ListPolicy.addResources('*');

    helloLambdaNodeJs.addToRolePolicy(s3ListPolicy);

    const optionsWithAuthorizer: MethodOptions = {
      authorizationType: AuthorizationType.COGNITO,
      authorizer: {
        authorizerId: this.authorizer.authorizer.authorizerId,
      },
    };

    // Hello Api lambda integration:
    const helloLambdaIntegration = new LambdaIntegration(helloLambdaNodeJs);
    const helloLambdaResource = this.api.root.addResource('hello');
    helloLambdaResource.addMethod('GET', helloLambdaIntegration, optionsWithAuthorizer);

    // Spaces API integration
    const spaceResource = this.api.root.addResource('spaces');
    spaceResource.addMethod('POST', this.spacesTable.createLambdaIntegration);
    spaceResource.addMethod('GET', this.spacesTable.readLambdaIntegration);
    spaceResource.addMethod('PUT', this.spacesTable.updateLambdaIntegration);
    spaceResource.addMethod('DELETE', this.spacesTable.deleteLambdaIntegration);
  }

  private initializeSuffix() {
    const shortStackId = Fn.select(2, Fn.split('/', this.stackId));
    const Suffix = Fn.select(4, Fn.split('-', shortStackId));
    this.suffix = Suffix;
  }

  private initializeSpacesPhotoBucket() {
    this.spacesPhotoBucket = new Bucket(this, 'spaces-photos', {
      bucketName: 'spaces-photos-' + this.suffix,
      cors: [
        {
          allowedMethods: [HttpMethods.HEAD, HttpMethods.GET, HttpMethods.PUT],
          allowedOrigins: ['*'],
          allowedHeaders: ['*'],
        },
      ],
    });

    new CfnOutput(this, 'spaces-photos-bucket-name', {
      value: this.spacesPhotoBucket.bucketName,
    });
  }
}
