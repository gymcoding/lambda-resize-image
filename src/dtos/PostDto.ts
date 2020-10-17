import {
  IsNotEmpty,
  IsPositive,
  IsNumber,
  Max,
  IsString,
  IsOptional,
} from 'class-validator'
import { Post } from '../entities/Post'

/**
 * 포스트 생성 DTO
 */
export class CreatePostDto {
  public id: string
  @IsNotEmpty()
  public title: string

  @IsNotEmpty()
  public content: string
  public createdAt: number
  public updatedAt: number

  public toEntity (): Post {
    const { id, title, content, createdAt, updatedAt } = this
    const post = new Post()
    post.title = title
    post.content = content
    post.id = id
    post.createdAt = createdAt
    post.updatedAt = updatedAt

    return post
  }
}

/**
 * 포스트 수정 DTO
 */
export class UpdatePostDto {
  @IsNotEmpty()
  public title: string

  @IsNotEmpty()
  public content: string
}

/**
 * 포스트 목록 페이징 DTO
 */
export class PageablePostDto {
  @IsNumber()
  public offset: number

  @IsNumber()
  @Max(20)
  @IsPositive()
  public limit: number

  @IsOptional()
  @IsString()
  public sort: string
}
