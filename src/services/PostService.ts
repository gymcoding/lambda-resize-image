import { Service } from 'typedi'
import { Post } from '../entities/Post'
import { CreatePostDto } from '../dtos/PostDto'
import * as uuid from 'uuid'
import { DynamoDB } from 'aws-sdk'

@Service()
export class PostService {
  private dynamoDb: DynamoDB.DocumentClient = new DynamoDB.DocumentClient({ region: 'ap-northeast-2' })
  private tableName: string = process.env.DYNAMODB_TABLE || ''
  constructor () {
    console.log('### PostService Construct ###')
  }

  public async createPost (
    createPostDto: CreatePostDto
  ): Promise<Post> {
    const timestamp = new Date().getTime()
    createPostDto.id = uuid.v1()
    createPostDto.createdAt = timestamp
    createPostDto.updatedAt = timestamp
    const params = {
      TableName: this.tableName,
      Item: createPostDto
    }
    await new Promise((resolve, reject) => {
      this.dynamoDb.put(params, (error, result) => {
        if (error) {
          return reject(error)
        }
        return resolve(result)
      })
    })
    return createPostDto.toEntity()
  }
  /**
   * 포스트 목록을 조회한다.
   * @param offset offset
   * @param limit limit
   * @param sort best는 주간 인기글을 조회하고 best가 아니면 일반 최신글을 조회한다.
   */
  public async getPosts () {
    return [
      { title: '타이틀', contents: '내용' }
    ]
  }
}
