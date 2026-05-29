import { 
    Column, 
    CreateDateColumn, 
    Entity, 
    PrimaryGeneratedColumn, 
    UpdateDateColumn, 
    DeleteDateColumn, 
    ManyToOne, 
    OneToMany,
    JoinColumn
} from "typeorm";

import type { Party_Type } from "./party_type";
import type { Party_Member } from "./party_member";

@Entity({ name: "party" })
export class Party {
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

    @ManyToOne("Party_Type", (partyType: Party_Type) => partyType.parties, { onDelete: "SET NULL" })
    @JoinColumn({ name: "party_type_id" })
    partyType!: Party_Type;

    @OneToMany("Party_Member", (party_member: Party_Member) => party_member.party)
    party_members!: Party_Member[];
}