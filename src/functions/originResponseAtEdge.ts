'use strict'

const http = require('http')
const https = require('https')
const querystring = require('querystring')

const AWS = require('aws-sdk')
const S3 = new AWS.S3({
  signatureVersion: 'v4',
})
const Sharp = require('sharp')

// set the S3 and API GW endpoints
const BUCKET = 'opensls-image-dev'

module.exports.handler = (event: any, context: any, callback: any) => {
  let response = event.Records[0].cf.response
  console.log('Response status code :%s', response.status)

  // 이미지가 없는지 확인
  if (response.status === 404) {
    let request = event.Records[0].cf.request
    let params = querystring.parse(request.querystring)
    console.log('request: ', request)
    console.log('params: ', params)
    // 차원 속성이 없으면 응답을 전달하십시오.
    if (!params.d) {
      callback(null, response)
      return
    }

    // 치수 매개 변수 값 = 너비 x 높이를 읽고 'x'로 분할합니다.
    let dimensionMatch = params.d.split('x')
    console.log('dimensionMatch: ', dimensionMatch)

    // 필요한 경로를 읽으십시오. 예 : uri /images/100x100/webp/image.jpg
    let path = request.uri
    console.log('path: %s', path)
    // 경로 변수에서 S3 키를 읽습니다.
    // 예 : 경로 변수 /images/100x100/webp/image.jpg
    let key = path.substring(1)

    // 접두사, 너비, 높이 및 이미지 이름을 구문 분석합니다.
    // 예 : key = images / 200x200 / webp / image.jpg
    let prefix, originalKey, match, width: number, height: number, requiredFormat: string, imageName
    let startIndex

    try {
      match = key.match(/(.*)\/(\d+)x(\d+)\/(.*)\/(.*)/)
      prefix = match[1]
      width = parseInt(match[2], 10)
      height = parseInt(match[3], 10)

      // 'Sharp'에 필요한 jpg 보정
      requiredFormat = match[4] === 'jpg' ? 'jpeg' : match[4]
      imageName = match[5]
      originalKey = prefix + '/' + imageName
    } catch (err) {
      // 이미지에 대한 접두사가 없습니다 ..
      console.log('no prefix present..')
      match = key.match(/(\d+)x(\d+)\/(.*)\/(.*)/)
      width = parseInt(match[1], 10)
      height = parseInt(match[2], 10)

      // 'Sharp'에 필요한 jpg 보정
      requiredFormat = match[3] === 'jpg' ? 'jpeg' : match[3]
      imageName = match[4]
      originalKey = imageName
    }

    // 소스 이미지 파일 가져 오기
    S3.getObject({ Bucket: BUCKET, Key: originalKey }).promise()
      // 크기 조정 작업 수행
      .then((data: any) => Sharp(data.Body)
        .resize(width, height)
        .toFormat(requiredFormat)
        .toBuffer()
      )
      .then((buffer: any) => {
        // 적절한 객체 키를 사용하여 크기가 조정 된 객체를 S3 버킷에 저장합니다.
        S3.putObject({
            Body: buffer,
            Bucket: BUCKET,
            ContentType: 'image/' + requiredFormat,
            CacheControl: 'max-age=31536000',
            Key: key,
            StorageClass: 'STANDARD'
        }).promise()
        // 객체를 저장하는 데 예외가 있어도 생성 된
        // 아래 뷰어로 다시 이미지
        .catch(() => {
          console.log('Exception while writing resized image to bucket')
        })

        // 크기가 조정 된 이미지로 이진 응답 생성
        response.status = 200
        response.body = buffer.toString('base64')
        response.bodyEncoding = 'base64'
        response.headers['content-type'] = [{ key: 'Content-Type', value: 'image/' + requiredFormat }]
        console.log('response: ', response)
        callback(null, response)
      })
    .catch((err: any) => {
      console.log('Exception while reading source image :%j',err)
    })
    // 응답 statusCode를 확인하는 if 블록의 끝
  } else {
    // 응답을 통과시키다
    callback(null, response)
  }
  // const response = event.Records[0].cf.response
  // const request = event.Records[0].cf.request
  // const headers = response.headers
  // headers['x-serverless-time'] = [{ key: 'x-serverless-time', value: Date.now().toString() }]
  // console.log(`### request: ${JSON.stringify(request)}, response: ${JSON.stringify(response)}, headers: ${JSON.stringify(headers)} ###`)
  // return callback(null, response)
}
