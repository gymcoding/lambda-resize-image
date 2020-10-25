# Lambda Resize Image
AWS Lambda@Edge를 활용한 On the fly 이미지 리사이즈를 위한 서버리스 코드입니다.

## 사용기술
- aws-serverless-express
- express
- routing-controllers
- lerna

## 함수배포
1. Event Type: view-request 핸들링 함수 배포
```sh
serverless deploy function -f viewerRequestAtEdge
```
2. Event Type: origin-response 핸들링 함수 배포
```sh
serverless deploy function -f originResponseAtEdge
```

## 주의사항
- Sharp 모듈 Lambda Install
  - https://sharp.pixelplumbing.com/install#aws-lambda


# serverless cloud front 설정 참고
 - https://www.serverless.com/framework/docs/providers/aws/events/cloudfront/
# cloud front 설정값 참고
 - https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-values-specify.html