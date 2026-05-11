import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, Column } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Item } from '../../items/entities/item.entity';

@Entity('spin_history')
export class SpinHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (u) => u.history, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Item, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'item_id' })
  item: Item;

  @Column({ nullable: true, type: 'text' })
  ai_response: string;

  @CreateDateColumn()
  created_at: Date;
}
