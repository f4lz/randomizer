import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { SpinHistory } from '../../spin/entities/spin-history.entity';
import { Favorite } from '../../favorites/entities/favorite.entity';
import { ExcludedItem } from '../../excluded/entities/excluded-item.entity';
import { Item } from '../../items/entities/item.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true, unique: true })
  vk_id: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => SpinHistory, (h) => h.user)
  history: SpinHistory[];

  @OneToMany(() => Favorite, (f) => f.user)
  favorites: Favorite[];

  @OneToMany(() => ExcludedItem, (e) => e.user)
  excluded: ExcludedItem[];

  @OneToMany(() => Item, (i) => i.owner)
  items: Item[];
}
