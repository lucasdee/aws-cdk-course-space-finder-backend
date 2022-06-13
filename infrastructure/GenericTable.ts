import { Stack } from 'aws-cdk-lib';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { join } from 'path';

export interface TableProps {
  tableName: string;
  primaryKey: string;
  createLambdaPath?: string;
  readLambdaPath?: string;
  updateLambdaPath?: string;
  deleteLambdaPath?: string;
}

export class GenericTable {
  private stack: Stack;
  private table: Table | undefined;
  private props: TableProps;

  private createLambda: NodejsFunction | undefined;
  private readLambda: NodejsFunction | undefined;
  private updateLambda: NodejsFunction | undefined;
  private deleteLambda: NodejsFunction | undefined;

  public createLambdaIntegration: LambdaIntegration | undefined;
  public readLambdaIntegration: LambdaIntegration | undefined;
  public updateLambdaIntegration: LambdaIntegration | undefined;
  public deleteLambdaIntegration: LambdaIntegration | undefined;

  public constructor(stack: Stack, props: TableProps) {
    this.stack = stack;
    this.props = props;
    this.initialize();
  }

  private initialize() {
    this.createTable();
  }

  private createTable() {
    this.table = new Table(this.stack, this.props.tableName, {
      tableName: this.props.tableName,
      partitionKey: {
        name: this.props.primaryKey,
        type: AttributeType.STRING,
      },
    });
  }

  private createSingleLambda(lambdaName: string): NodejsFunction {
    const lambdaId = `${this.props.tableName}-${lambdaName}`;
    return new NodejsFunction(this.stack, lambdaId, {
      entry: join(
        __dirname,
        '..',
        'services',
        this.props.tableName,
        `${lambdaName}.ts`
      ),
      handler: 'handler',
    });
  }
}
