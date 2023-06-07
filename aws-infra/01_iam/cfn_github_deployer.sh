#!/bin/bash -e

pushd "$(dirname $0)" > /dev/null
source ../../.env

# Get Github Thumbprint
ServerUrl=token.actions.githubusercontent.com
GithubThumbprint=$(openssl s_client -servername $ServerUrl -showcerts -connect $ServerUrl:443 < /dev/null 2>/dev/null \
  | grep "BEGIN CERTIFICATE" -A40 | tail -41 | grep 'END CERTIFICATE' -B 32 \
  | openssl x509 -fingerprint -sha1 -noout | sed -e 's/://g' | cut -d= -f2)

echo "Github Thumbprint: ${GithubThumbprint}"

if [ -z ${GithubThumbprint} ]; then
  echo "Github Thumbprint can't be null"
  exit 1
fi

CfnStack=${PROJECT_NAME}-github-deployer
CfnTemplate=cfn_github_deployer.yml

# https://awscli.amazonaws.com/v2/documentation/api/latest/reference/cloudformation/deploy.html
aws cloudformation deploy \
  --template-file $CfnTemplate \
  --stack-name $CfnStack \
  --no-fail-on-empty-changeset \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides \
      ProjectName=$PROJECT_NAME \
      RepositoryPath=$REPOSITORY_PATH \
      GithubThumbprint=$GithubThumbprint

popd > /dev/null