import { 
    Column,
    CreateDateColumn, 
    DeleteDateColumn, 
    Entity, 
    JoinColumn, 
    ManyToOne, 
    PrimaryGeneratedColumn, 
    UpdateDateColumn 
} from "typeorm";

import type { Party } from "./party";

@Entity({ name: "party_member" })
export class Party_Member {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne("Party", (party: Party) => party.party_members, { onDelete: "CASCADE" })
    @JoinColumn({ name: "party_id" })
    party!: Party;

    @Column()
    user_id!: string;
    
    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    created_at!: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    updated_at!: Date;

    @DeleteDateColumn({ type: "timestamp", nullable: true })
    deleted_at?: Date;
}