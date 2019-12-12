---
title: Lambdaless
abstract: Serverless architectures without Lambda
---

Lets assume you need to expose a JSON file behind an API. Using a serverless approach with AWS, you might first reach for an architecture like the following:

[![API Gateway to Lambda to S3][apiglth]][apigl]

[apigl]: /assets/img/api-gateway-to-lambda-to-s3.png
[apiglth]: /assets/img/th/api-gateway-to-lambda-to-s3.png 'API Gateway to Lambda to S3'

... i.e. an API Gateway in front of a Lambda, which calls S3. Alternatively, did you know you could remove the Lambda and have API Gateway call S3 directly?

[![API Gateway to Lambda][apigth]][apig]

[apig]: /assets/img/api-gateway-to-s3.png
[apigth]: /assets/img/th/api-gateway-to-s3.png 'API Gateway to S3'

This is what I call "Lambdaless". It leverages API Gateway's `AWS` [integration type][], which allows you to expose any AWS service without any intermediate application logic. [Mapping templates][] provide the glue to transform request/responses, using the [Velocity][] templating language (VTL) and [JSONPath][] expressions.

[integration type]: https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-integration-types.html
[mapping templates]: https://docs.aws.amazon.com/apigateway/latest/developerguide/models-mappings.html
[velocity]: https://velocity.apache.org/engine/devel/vtl-reference.html
[jsonpath]: https://goessner.net/articles/JsonPath/

## Walkthrough

Continuing with the S3 example above, create an API Gateway with a GET method and set up the integration request per the following:

- choose the AWS service type, region and Simple Storage Service (S3)
- select the GET HTTP method
- select the "use path override" action type
- enter the object's `<bucket>/<prefix>` in the path override field

[![API Gateway S3 Integration Request][apigs3ireqth]][apigs3ireq]

[apigs3ireq]: /assets/img/api-gateway-s3-integration-request.png
[apigs3ireqth]: /assets/img/th/api-gateway-s3-integration-request.png 'API Gateway S3 Integration Request'

Create an IAM role that has a policy that has `s3:GetObject` permission on your `<bucket>/<prefix>` and a Trust Relationship that allows the API Gateway to assume it to be so. Now all you need to do is switch to the test view, click "test" and you should see the contents of your JSON object in the response body:

[![API Gateway S3 Request][apigs3resth]][apigs3res]

[apigs3res]: /assets/img/api-gateway-s3-response.png
[apigs3resth]: /assets/img/th/api-gateway-s3-response.png 'API Gateway S3 Response'

## Examples

### Mock integration

Taking the JSON example to its logical conclusion, we can go a step further and remove S3 from the equation altogether. Choose the `MOCK` integration type, add the required `{"statusCode": 200}` request mapping template and move the contents of your JSON object to the integration response mapping template.

This approach typically yields ~3ms response times (compared to ~65ms with the additional hop to S3) and is a good solution for static data.

### DynamoDB

Simple CRUD APIs with DynamoDB are a great fit for Lambdaless. API Gateway's [\$context variables][context] includes `$context.requestId`, which can be used as a entity's UUID, along with `$context.requestTimeEpoch` for created/updated at timestamps.

Request/response templates can be used to convert to/from DynamoDB's [data type descriptors][], for example:

```json
#set($inputRoot = $input.path('$'))
{
  "TableName": "my-table",
  "Key": {
    "uuid": {
      "S": "$context.requestId"
    }
  },
  "Item": {
    "uuid": {
      "S": "$context.requestId"
    },
    "name": {
      "S": "$inputRoot.name"
    },
    "items": {
      "L": [
        #foreach($item in $inputRoot.items)
        {
          "S": "$item"
        }#if($foreach.hasNext),#end
        #end
      ]
    },
    "createdAt": {
      "N": "$context.requestTimeEpoch"
    }
  }
}
```

[context]: https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-mapping-template-reference.html#context-variables-template-example
[data type descriptors]: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Programming.LowLevelAPI.html#Programming.LowLevelAPI.DataTypeDescriptors

### Other ideas

- use the `HTTP_PROXY` integration to bypass region-locked websites
- pump events into an SQS queue
- raise AWS Support tickets using your existing customer service solution

## Advantages

A simple Lambda may seem innocuous at first, but each function comes with their own maintenance cost including:

- maintaining the application code
- maintaining dependencies
- any CI/CD tooling around delivering that code
- performing runtime upgrades
- security scanning
- configuring monitoring and alerts (e.g. CloudWatch)
- configuring instrumentation (e.g. X-Ray)

Removing a Lambda means fewer resources to maintain, test and pay for.
Latency is also reduced. There are less hops in the chain and the issue of cold starts disappears.

## Disadvantages

There are however a number drawbacks to consider with this Lambdaless method. Probably most apparent is the fact that you can only integrate with a single service at a time. This limits the approach to simple integrations and rules out complex logic e.g. joins.

Velocity, whilst offering some level of [control flow][vtl-directives] such as `if/else` and loops, as well as AWS's own extensions such as [util functions][], is somewhat of a niche language and introduces its own complexity over using your Lambda runtime language of choice (e.g. JavaScript, Python).

This approach is also tightly coupled with API Gateway. The `AWS` integration type and request/response mapping template approach is unique to API Gateway and therefore is less portable than Lambda application logic (which is easier to abstract from the Lambda environment itself).

It also relies on "low-level" AWS APIs, which are less accessible and often sparsely documented compared to their corresponding SDK wrappers.

[vtl-directives]: https://velocity.apache.org/engine/devel/vtl-reference.html#directives
[util functions]: https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-mapping-template-reference.html#util-template-reference

## Further reading

- [Using Amazon API Gateway as a proxy for DynamoDB][ex1]
- [Serverless and Lambdaless Scalable CRUD Data API with AWS API Gateway and DynamoDB][ex2]

[ex1]: https://aws.amazon.com/blogs/compute/using-amazon-api-gateway-as-a-proxy-for-dynamodb/
[ex2]: https://medium.com/hackernoon/serverless-and-lambdaless-scalable-crud-data-api-with-aws-api-gateway-and-dynamodb-626161008bb2
