import { RemovalPolicy, Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {
  aws_s3,
} from 'aws-cdk-lib';
import { BucketAccessControl } from 'aws-cdk-lib/aws-s3';

export class PatikaCloudStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    //Resource Pyhsical ID
    const buck = new aws_s3.Bucket(this, 'BenimGuzelManolyam', {
      accessControl: BucketAccessControl.PRIVATE,
    });

    new CfnOutput(this, 'PatikaS3BucketARN', {
      value: buck.bucketArn,
      exportName: 'PatikaS3BucketARN'
    });

  }
}
