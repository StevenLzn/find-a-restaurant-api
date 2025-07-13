import { UserActionType } from 'src/common/enums/user-action-type.enum';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('user_actions')
export class UserAction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.actions)
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Column({ type: 'uuid', nullable: true })
  user_id: string | null;

  @Column({ type: 'enum', enum: UserActionType })
  action: UserActionType;

  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  date: Date;

  @Column({ type: 'text', nullable: true })
  request_body?: string;

  @Column({ type: 'text', nullable: true })
  request_params?: string;

  @Column({ length: 50 })
  resource: string;

  @Column({ length: 50 })
  status?: string;
}
