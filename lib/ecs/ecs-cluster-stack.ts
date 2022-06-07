import { RemovalPolicy, Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {
  aws_ecs,
  aws_ec2,
} from 'aws-cdk-lib';
import { getConfig } from '../config';

export class PatikaECSClusterStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const conf = getConfig(scope);

    const vpc = aws_ec2.Vpc.fromVpcAttributes(this, 'Vpc', {
      vpcId: conf.vpcId,
      availabilityZones: conf.availabilityZones,
      publicSubnetIds: conf.publicSubnetIds,
    });

    const cluster = new aws_ecs.Cluster(this, 'PatikaCloudECSCluster', {
      clusterName: 'patika-cloud-cluster',
      vpc,
    });

    new CfnOutput(this, 'PatikaCloudECSClusterARN', {
      exportName: 'PatikaCloudECSClusterARN',
      value: cluster.clusterArn
    });

  }
}
