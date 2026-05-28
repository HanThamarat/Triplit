
import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm";
import z from 'zod';

@Entity({ name: "Users" })
export class Users {
    @PrimaryGeneratedColumn()
    user_id!: number

    @Column()
    name!: string

    @Column({ unique: true })
    email!: string

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    created_at!: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    updated_at!: Date;
} 

export const userSchema = z.object({

});

export type userSchemaType = z.infer<typeof userSchema>;