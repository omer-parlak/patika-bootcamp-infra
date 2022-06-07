import { RemovalPolicy, Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {
  aws_ecr
} from 'aws-cdk-lib';

export class PatikaBackendECRStack extends Stack {

  ecrRepo: aws_ecr.Repository;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.ecrRepo = new aws_ecr.Repository(this, 'PatikaBackendECRRepository', {
      repositoryName: 'patika-backend',
      removalPolicy: RemovalPolicy.RETAIN,
    });

    new CfnOutput(this, 'PatikaBackendECRRepositoryARN', {
      exportName: 'PatikaBackendECRRepositoryARN',
      value: this.ecrRepo.repositoryArn,
    });
    
  }
}
