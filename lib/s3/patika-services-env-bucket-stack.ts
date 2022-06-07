import { RemovalPolicy, Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {
  aws_s3,
} from 'aws-cdk-lib';
import { getConfig } from '../config';

export class PatikaServicesEnvBucketStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const config = getConfig(scope);

    const bucket = new aws_s3.Bucket(this, 'PatikaServicesEnvBucket', {
      bucketName: `${config.account}-${config.region}-patika-services-env-bucket`,
      blockPublicAccess: {
        blockPublicAcls: true,
        blockPublicPolicy: true,
        ignorePublicAcls: true,
        restrictPublicBuckets: true,
      }
    });

    new CfnOutput(this, 'PatikaServicesEnvBucketARN', {
      exportName: 'PatikaServicesEnvBucketARN',
      value: bucket.bucketArn
    });

    new CfnOutput(this, 'PatikaServicesEnvBucketName', {
      exportName: 'PatikaServicesEnvBucketName',
      value: bucket.bucketName
    });

  }
}
