import { 
    Column, 
    CreateDateColumn, 
    DeleteDateColumn, 
    Entity, 
    OneToMany, 
    PrimaryGeneratedColumn, 
    UpdateDateColumn 
} from "typeorm";

import type { Party } from "./party";

@Entity({ name: "party_type" })
export class Party_Type {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    created_at!: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updated_at!: Date;

    @DeleteDateColumn({ type: "timestamp", nullable: true })
    deleted_at?: Date;

    @OneToMany("Party", (party: Party) => party.partyType)
    parties!: Party[];
}