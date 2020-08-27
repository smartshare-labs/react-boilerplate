# React Boilerplate

This app is designed to work hand-in-hand with the [Django-Serverless](https://github.com/smartshare-labs/django-serverless) backend.

## Developer Setup

1. Install node modules: `npm install`
2. Start the dev server: `npm start`

## Deployment

0. Create an S3 bucket to host your app. Grab the bucket name, and add it to `./bin/deploy.sh`.
1. Make sure you have an [AWS profile](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html) with valid credentials on your local machine. This will allow you to deploy your app to S3.
1. From the project root, run `./bin/deploy.sh staging` (you can replace `staging` with `pre-prod` or `prod`)
1. Your app should now be hosted at the DNS configured for your S3 bucket!

## Questions?

If you have questions or general feedback, please create an issue in this repo. Alternatively, you can reach out to the maintainers by emailing support@smartshare.io.
