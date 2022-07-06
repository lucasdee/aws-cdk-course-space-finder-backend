import { CfnOutput, Stack } from 'aws-cdk-lib';
import { CloudFrontWebDistribution } from 'aws-cdk-lib/aws-cloudfront';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { join } from 'path';

export class WebAppDeployment {
  private stack: Stack;
  private bucketSuffix: string;
  private deplaymentBucket: Bucket;

  constructor(stack: Stack, bucketSuffix: string) {
    this.stack = stack;
    this.bucketSuffix = bucketSuffix;
    this.initialize();
  }

  private initialize() {
    const bucketName = 'space-app-web' + this.bucketSuffix;

    this.deplaymentBucket = new Bucket(this.stack, 'space-app-web-id', {
      bucketName: bucketName,
      publicReadAccess: true,
      websiteIndexDocument: 'index.html',
    });

    new BucketDeployment(this.stack, 'space-app-web-id-deployment', {
      destinationBucket: this.deplaymentBucket,
      sources: [Source.asset(join(__dirname, '..', '..', 'aws-cdk-course-space-finder-frontend', 'build'))],
    });

    new CfnOutput(this.stack, 'spaceFinderWebAppS3Url', {
      value: this.deplaymentBucket.bucketWebsiteUrl,
    });

    const cloudFront = new CloudFrontWebDistribution(this.stack, 'space-app-web-distribution', {
      originConfigs: [
        {
          behaviors: [
            {
              isDefaultBehavior: true,
            },
          ],
          s3OriginSource: {
            s3BucketSource: this.deplaymentBucket,
          },
        },
      ],
    });

    new CfnOutput(this.stack, 'spaceFinderWebAppCloudFrontUrl', {
      value: cloudFront.distributionDomainName,
    });
  }
}
