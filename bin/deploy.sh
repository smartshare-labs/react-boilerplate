#! /bin/bash
set -e

environment=$1

if [ "$environment" == "staging" ]; then
  s3_bucket="virtual-seminar.beta.staging"
  aws_profile="smartshare-sls"
elif [ "$environment" == "pre-prod" ]; then
  s3_bucket="virtual-seminar.beta.staging"
  aws_profile="smartshare-sls"
elif [ "$environment" == "prod" ]; then
  s3_bucket="virtual-seminar.beta.staging"
  aws_profile="smartshare-sls"
else
  echo "Invalid environment \"$environment\". Must be one of (\"staging\",\"pre-prod\", \"prod\")"
  exit 1
fi

npm run "build:$environment"

aws --profile "$aws_profile" s3 sync ./build "s3://$s3_bucket/" --exact-timestamps --cache-control max-age=0
