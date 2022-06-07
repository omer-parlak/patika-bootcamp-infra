#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { PatikaCloudStack } from '../lib/patika-cloud-stack';
import { PatikaVpcStack } from '../lib/vpc';
import { PatikaVPNServer } from '../lib/ec2';
import { getConfig } from '../lib/config';

const app = new cdk.App();
const conf = getConfig(app);
const env = {
  account: conf.account,
  region: conf.region,
};

new PatikaCloudStack(app, 'PatikaCloudStack', { env });
new PatikaVpcStack(app, 'PatikaVpcStack', { env });
new PatikaVPNServer(app, 'PatikaVPNServer', { env });
