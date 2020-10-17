# Issues
1. src/todos/create.ts 에서 params Warning 무시하기
2. sls deploy 시 typescript build에 src/** 소스 추가하여 빌드하기
  - serverless-plugin-typescript는 종속된(import) 모듈만 컴파일(ts -> js) 함
    - 해결1] app.ts에 종속성 추가 import * as allControllers from './src/controllers' (선택)
    - 해결2] sls deploy 전에 npm run tsc로 전체 컴파일 진행
3. sls deploy 시 콘솔 Warning 제거하