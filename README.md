# User API in AWS Lambda

This repository provisions an AWS Lambda app to handle HTTP requests via AWS API Gateway Additionally, it also handles the provisioning of a DynamoDB database that is used for storing data about users.

## User Model

```typescript
  {
    userId: string;
    name: string;
    /* Any valid Javascript date format. */
    dob: string;
    email: string[];
  }
```

Javascript date format information can be found [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#date_time_string_format).

The API exposes four endpoints:
- `GET /user/:userId`

  Returns a `user` for `userId`.
  
- `POST /users`

  Creates a new user from the user passed in the payload.
- `PUT /user/:userId`

  Updates a user by `userId` to the value in the payload.
- `DELETE /user/:userId`

  Deletes a user by `userId`

## Usage

These instructions assume the user has `serverless` installed and configured with deployment permissions to their AWS stack. Creating the necessary IAM user and associated keys is described [here](https://prasadlakshan.medium.com/configuring-aws-credentials-using-serverless-framework-1b53f0989af4#948f). Follow the steps until you have the access and secret keys for the user. Then run `aws configure` to setup the environment to use the new IAM user's credentials.

### Deployment

Install dependencies with:

```
npm install
```

and then deploy with:

```
serverless deploy
```

After running deploy, you should see output similar to:

```
Deploying "aws-node-express-dynamodb-api" to stage "dev" (us-east-1)

✔ Service deployed to stack aws-node-express-dynamodb-api-dev (109s)

endpoint: ANY - https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com
functions:
  api: aws-node-express-dynamodb-api-dev-api (3.8 MB)
```

_Note_: In current form, after deployment, your API is public and can be invoked by anyone. For production deployments, you might want to configure an authorizer. For details on how to do that, refer to [`httpApi` event docs](https://www.serverless.com/framework/docs/providers/aws/events/http-api/). Additionally, in current configuration, the DynamoDB table will be removed when running `serverless remove`. To retain the DynamoDB table even after removal of the stack, add `DeletionPolicy: Retain` to its resource definition.

### Invocation

After successful deployment, you can create a new user by calling the corresponding endpoint:

```
curl --request POST 'https://xxxxxx.execute-api.us-east-1.amazonaws.com/users' --header 'Content-Type: application/json' --data-raw '{"name": "John", "userId": "someUserId", "dob": "12/1/2003", "email": ["john@mail.com"] }'
```

Which should result in the following response:

```json
  {
    "name": "John",
    "userId": "someUserId",
    "dob": "12/1/2003",
    "email": ["john@mail.com"]
  }
```

You can later retrieve the user by `userId` by calling the following endpoint:

```
curl https://xxxxxxx.execute-api.us-east-1.amazonaws.com/users/someUserId
```

Which should result in the following response:

```json
  {
    "name": "John",
    "userId": "someUserId",
    "dob": "12/1/2003",
    "email": ["john@mail.com"]
  }
```

### Local development

The easiest way to develop and test your function is to use the `dev` command:

```
serverless dev
```

This will start a local emulator of AWS Lambda and tunnel your requests to and from AWS Lambda, allowing you to interact with your function as if it were running in the cloud.

Now you can invoke the function as before, but this time the function will be executed locally. Now you can develop your function locally, invoke it, and see the results immediately without having to re-deploy.

When you are done developing, don't forget to run `serverless deploy` to deploy the function to the cloud.

## Testing

A full test suite is provided. To run it, run `npm run test`.
