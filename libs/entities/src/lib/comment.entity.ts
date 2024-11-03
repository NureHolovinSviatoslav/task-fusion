import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'comments',
})
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'task_id',
  })
  taskId: number;

  @Column()
  text: string;

  @Column({
    name: 'user_id',
  })
  userId: number;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}
