'use strict'
const querystring = require('querystring')

// defines the allowed dimensions, default dimensions and how much variance from allowed
// dimension is allowed.

const variables = {
  allowedDimension : [{ w: 100, h: 100 }, { w: 200, h: 200 }, { w: 300, h: 300 }, { w: 400, h: 400 }],
  defaultDimension : { w: 200, h: 200 },
  variance: 20,
  webpExtension: 'webp'
}

module.exports.handler = (event: any, context: any, callback: any) => {
  const request = event.Records[0].cf.request
  const headers = request.headers
  console.log(`### ~! request: ${JSON.stringify(request)}, headers: ${JSON.stringify(headers)} ###`)

  // 쿼리 문자열 키-값 쌍을 구문 분석합니다. 우리의 경우 d = 100x100
  const params = querystring.parse(request.querystring)

  // 원본 이미지의 URI 가져 오기
  let fwdUri = request.uri

  // 차원 속성이 없으면 요청을 전달하십시오.
  if (!params.d) {
    callback(null, request)
    return
  }
  // 치수 매개 변수 값 = 너비 x 높이를 읽고 'x'로 분할합니다~!
  const dimensionMatch = params.d.split('x')

  // 너비 및 높이 매개 변수 설정
  let width = dimensionMatch[0]
  let height = dimensionMatch[1]

  // URI에서 접두사, 이미지 이름 및 확장자를 구문 분석합니다.
  // 우리의 경우 /images/image.jpg

  const match = fwdUri.match(/(.*)\/(.*)\.(.*)/)
  console.log(`match: ${match}`)
  let prefix = match[1]
  let imageName = match[2]
  let extension = match[3]

  // 요청 된 차원이 허용되는 경우 true로 설정할 변수를 정의하십시오.
  let matchFound = false

  // 허용 가능한 분산을 계산하십시오. 이미지 크기가 105이고 허용 범위 내에있는 경우
  // 범위, 그러면 우리의 경우 치수는 100으로 수정됩니다.
  let variancePercent = (variables.variance / 100)

  for (let dimension of variables.allowedDimension) {
    let minWidth = dimension.w - (dimension.w * variancePercent)
    let maxWidth = dimension.w + (dimension.w * variancePercent)
    if (width >= minWidth && width <= maxWidth) {
      width = dimension.w
      height = dimension.h
      matchFound = true
      break
    }
  }
  // 허용 된 차원에서 차이가있는 일치 항목이 없으면 기본값으로 설정합니다.
  // 치수~!
  if (!matchFound) {
    width = variables.defaultDimension.w
    height = variables.defaultDimension.h
  }

  // 수락 헤더를 읽고 webP가 지원되는지 확인합니다.
  let accept = headers['accept'] ? headers['accept'][0].value : ''

  let url = []
  // 업스트림으로 전달할 새 URI를 빌드합니다.
  url.push(prefix)
  url.push(width + 'x' + height)

  // webp 지원 확인
  if (accept.includes(variables.webpExtension)) {
    url.push(variables.webpExtension)
  } else {
    url.push(extension)
  }
  url.push(imageName + '.' + extension)

  fwdUri = url.join('/')

  // final modified url is of format /images/200x200/webp/image.jpg
  request.uri = fwdUri
  request.querystring = querystring.stringify(params)
  console.log('request.querystring: ', request.querystring)
  console.log('RESULT request: ', JSON.stringify(request))
  callback(null, request)
}
