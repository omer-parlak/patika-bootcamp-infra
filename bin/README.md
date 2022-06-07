### Deploy scripts for ecs cluster
cdk deploy --app "npx ts-node bin/patika-computing.ts" PatikaECSClusterStack

### Deploy scripts for ecr stack
cdk deploy --app "npx ts-node bin/patika-computing.ts" PatikaBackendECRStack

### Deploy scripts for s3 env vars stack
cdk deploy --app "npx ts-node bin/patika-computing.ts" PatikaServicesEnvBucketStack
