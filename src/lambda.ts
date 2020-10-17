import * as awsServerlessExpress from 'aws-serverless-express'
import * as awsServerlessExpressMiddleware from 'aws-serverless-express/middleware'
// import * as bodyParser from 'body-parser'
import app from './app'
const binaryMimeTypes = [
  'application/javascript',
  'application/json',
  'application/octet-stream',
  'application/xml',
  'image/jpeg',
  'image/png',
  'image/jpg',
  'image/webp'
]

// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: true }))
app.use(awsServerlessExpressMiddleware.eventContext())
const server = awsServerlessExpress.createServer(app, undefined, binaryMimeTypes)
export const handler = (event: any, context: any) => {
  awsServerlessExpress.proxy(server, event, context)
}
