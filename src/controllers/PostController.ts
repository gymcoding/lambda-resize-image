import { JsonController, Controller, HttpCode, Param, Body, Get, Post, Put, Delete, Res } from 'routing-controllers'
import { Response } from 'express'
import { OpenAPI } from 'routing-controllers-openapi'
import { PostService } from '../services/PostService'

@OpenAPI({
  security: [{ basicAuth: [] }]
})
@JsonController()
export class PostController {
  constructor (
    private postService: PostService
  ) {
    console.log('PostController postService: ', postService)
  }

  @HttpCode(200)
  @Get('/posts')
  @OpenAPI({
    summary: 'Post 작성',
    statusCode: '201',
    security: [{ bearerAuth: [] }],
  })
  getAll (@Res() res: Response) {
    console.log('PostService: ', this.postService)
    return this.postService.getPosts()
  }

  @Get('/posts/:id')
  getOne (@Param('id') id: number) {
    return { user: 'ssosso', age: 30 }
  }

  @Get('/posts/test/test')
  getTest () {
    return 'Test'
  }

  @Post('/posts')
  public async post (@Body() post: any) {
    const newPost = await this.postService.createPost(post)
    return newPost
  }

  @Put('/posts/:id')
  put (@Param('id') id: number, @Body() post: any) {
    return 'Updating a post...'
  }

  @Delete('/posts/:id')
  remove (@Param('id') id: number) {
    return 'Removing post...'
  }
}
// const storage = getMetadataArgsStorage()
// const spec = routingControllersToSpec(storage)
// console.log(spec)
