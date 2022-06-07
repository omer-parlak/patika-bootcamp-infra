import { RemovalPolicy, Stack, StackProps, CfnOutput, Fn, aws_cloud9 } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {
  aws_ec2,
  aws_s3,
  aws_ecs,
  aws_iam,
  aws_elasticloadbalancingv2
} from 'aws-cdk-lib';
import { CommonStackProps } from '../common-stack-props';
import { getConfig } from '../config';

export class ECSFargateStack extends Stack {
  constructor(scope: Construct, id: string, props?: CommonStackProps) {
    super(scope, id, props);

    const conf = getConfig(scope);

    if (props?.ecrStack) {

      const vpc = aws_ec2.Vpc.fromVpcAttributes(this, 'Vpc', {
        vpcId: conf.vpcId,
        availabilityZones: conf.availabilityZones,
        publicSubnetIds: conf.publicSubnetIds,
      });
      const cluster = aws_ecs.Cluster.fromClusterArn(this, 'PatikaCloudECSCluster', Fn.importValue('PatikaCloudECSClusterARN'));

      const envBucket = aws_s3.Bucket.fromBucketAttributes(this, 'PatikaServicesEnvBucket', {
        bucketArn: Fn.importValue('PatikaServicesEnvBucketARN'),
        bucketName: Fn.importValue('PatikaServicesEnvBucketName'),
      });

      const executionRole = new aws_iam.Role(this, 'PatikaBackendFargateServiceIAMRole', {
        roleName: 'PatikaBackendFargateServiceIAMRole',
        assumedBy: new aws_iam.ServicePrincipal('ecs.amazonaws.com'),
      });

      const taskDef = new aws_ecs.FargateTaskDefinition(this, 'PatikaBackendFargateServiceTaskDef', {
        family: 'PatikaBackendFargateServiceTaskDef',
        cpu: 512,
        memoryLimitMiB: 1024,
        executionRole,
      });

      taskDef.addContainer('PatikaBackendServiceContainer', {
        containerName: 'patika-backend-service',
        image: aws_ecs.ContainerImage.fromEcrRepository(props.ecrStack),
        memoryReservationMiB: 512,
        portMappings: [
          {
            containerPort: 8080,
          }
        ],
        // environmentFiles: 
      });

      const service = new aws_ecs.FargateService(this, 'PatikaBackendFargateService', {
        serviceName: 'patika-backend-service',
        cluster,
        taskDefinition: taskDef,
        desiredCount: 1,
      });

      service.autoScaleTaskCount({
        maxCapacity: 5,
        minCapacity: 1,
      });

      const albSg = new aws_ec2.SecurityGroup(this, 'ALBsg', {
        securityGroupName: 'patika-cloud-alb-sg',
        vpc,
        allowAllOutbound: true,
      });

      albSg.addIngressRule(aws_ec2.Peer.anyIpv4(), aws_ec2.Port.tcp(80), 'allow access from anywhere to http port');
      albSg.addIngressRule(aws_ec2.Peer.anyIpv4(), aws_ec2.Port.tcp(443), 'allow access from anywhere to https port');

      const serviceAlb = new aws_elasticloadbalancingv2.ApplicationLoadBalancer(this, 'PatikaBackendALB', {
        loadBalancerName: 'patika-cloud-alb',
        vpc,
        internetFacing: true,
        securityGroup: albSg,
        deletionProtection: true,
      });

      serviceAlb.addListener('httpListener', {
        port: 80,
        protocol: aws_elasticloadbalancingv2.ApplicationProtocol.HTTP
      });

    }

  }
}
