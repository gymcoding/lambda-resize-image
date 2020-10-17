import { PostService } from '../../../src/services/PostService'
import { Post } from '../../../src/entities/Post'
import { CreatePostDto, UpdatePostDto } from '../../../src/dtos/PostDto'

// [참고]
// https://github.com/JHyeok/jaebook-server/blob/master/test/unit/services/PostService.test.ts
describe('PostService', () => {
  let postService: PostService

  beforeAll(async () => {
    console.log('PostService beforeAll')
    process.env.DYNAMODB_TABLE = 'lambda-microservice-bolierplate-dev'
    postService = new PostService()
  })

  afterAll(() => {
    console.log('PostService afterAll')
  })
  const request = {
    title: '테스트 제목 입니다.',
    content: '테스트 내용 입니다.'
  }

  const createPostDto = new CreatePostDto()
  createPostDto.title = request.title
  createPostDto.content = request.content

  let newPostId: string

  it('포스트를 생성한다', async () => {
    const newPost = await postService.createPost(createPostDto)
    expect(newPost.title).toBe(request.title)
    expect(newPost.content).toBe(request.content)
    expect(newPost.id).not.toBeNull()
    expect(newPost.createdAt).not.toBeNull()
    expect(newPost.updatedAt).not.toBeNull()
  })

  // it('Id가 일치하는 포스트를 찾아서 true를 반환한다', async () => {
  //   const result = await postService.isPostById(newPostId)
  //   expect(result).toBeTruthy()
  // })

  // it('Id가 일치하는 포스트를 찾지 못해서 false를 반환한다', async () => {
  //   const result = await postService.isPostById('notPostId')
  //   expect(result).toBeFalsy()
  // })

  // it('Id가 일치하는 포스트를 찾아서 포스트 정보를 반환한다', async () => {
  //   const post = await postService.getPostById(newPostId)
  //   expect(post).toBeInstanceOf(Post)
  //   expect(post.title).toBe(request.title)
  //   expect(post.content).toBe(request.content)
  // })

  // it('포스트 목록을 반환한다', async () => {
  //   const posts = await postService.getPosts(0, 20)
  //   expect(posts[0].title).toBe(request.title)
  //   expect(posts[0].previewContent).toBe(request.previewContent)
  //   expect(posts[0].user.realName).toBe(request.user.realName)
  //   expect(posts[0].user.email).toBe(request.user.email)
  // })

  // it('포스트를 수정한다', async () => {
  //   const post = await postService.updatePost(
  //     newPostId,
  //     updatePostDto,
  //     request.user.id,
  //   )
  //   expect(post).toBeInstanceOf(Post)
  //   expect(post.title).toBe(request.updateTitle)
  //   expect(post.content).toBe(request.updateContent)
  // })

  // it('권한이 없는 사람이 포스트 수정에 실패한다', async () => {
  //   const post = await postService.updatePost(
  //     newPostId,
  //     updatePostDto,
  //     'notUserId',
  //   )
  //   expect(post).toBeNull()
  // })

  // it('권한이 없는 사람이 포스트 삭제에 실패한다', async () => {
  //   const result = await postService.deletePost(newPostId, 'notUserId')
  //   expect(result).toBeFalsy()
  // })

  // it('권한이 있는 사람이 포스트 삭제에 성공한다', async () => {
  //   const result = await postService.deletePost(newPostId, request.user.id)
  //   expect(result).toBeTruthy()
  // })
})
