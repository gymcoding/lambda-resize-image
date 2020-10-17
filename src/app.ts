import 'reflect-metadata'
import { validationMetadatasToSchemas } from 'class-validator-jsonschema'
import { Express } from 'express'
import { Container } from 'typedi'
import {
  useContainer,
  createExpressServer,
  getMetadataArgsStorage
} from 'routing-controllers'
import { routingControllersToSpec } from 'routing-controllers-openapi'
import * as swaggerUiExpress from 'swagger-ui-express'
import * as allControllers from './controllers' // serverless-plugin-typescript 에서 컴파일을 하기 위한 종속성(import) 추가

useContainer(Container)
const routingControllersOptions = {
  cors: true,
  controllers: [__dirname + '/controllers/*.js'],
  // middlewares: [__dirname + '/middlewares/*.js'],
  routePrefix: '/api'
}
const app: Express = createExpressServer(routingControllersOptions)

const schemas = validationMetadatasToSchemas({
  refPointerPrefix: '#/components/schemas/'
})

// Parse routing-controllers classes into OpenAPI spec:
const storage = getMetadataArgsStorage()
const spec = routingControllersToSpec(storage, routingControllersOptions, {
  components: {
    schemas,
    securitySchemes: {
      basicAuth: {
        scheme: 'basic',
        type: 'http'
      }
    }
  },
  info: {
    title: 'Open Serverless API',
    description: 'Open Serverless Mcroservice API',
    version: '1.0.0'
  }
})

app.use('/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(spec))
app.get('/test', (req, res, next) => {
  res.json({
    name: 'ssosso',
    age: 30
  })
})
app.get('/', (_req, res) => {
  res.json(spec)
})
export default app
