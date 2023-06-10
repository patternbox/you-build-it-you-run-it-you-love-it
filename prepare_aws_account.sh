#!/bin/bash -e

AWS_REGION=$(aws configure get region)
AWS_ACCOUNT=$(aws sts get-caller-identity --query "Account" --output text)
echo "AWS_Account: $AWS_ACCOUNT, AWS_Region: $AWS_REGION"

aws-infra/01_iam/cfn_github_deployer.sh

cdk bootstrap aws://$AWS_ACCOUNT/$AWS_REGION
