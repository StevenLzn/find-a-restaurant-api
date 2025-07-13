import { UserAction } from '../../../../src/modules/user-actions/entities/user-action.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
    length: 150,
  })
  email: string;

  @Column({
    length: 100,
  })
  password: string;

  @Column({
    length: 50,
  })
  name: string;

  @Column({
    length: 50,
  })
  lastname: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column({
    default: true,
  })
  isActive: boolean;

  @OneToMany(() => UserAction, (action) => action.user)
  actions: UserAction[];
}
