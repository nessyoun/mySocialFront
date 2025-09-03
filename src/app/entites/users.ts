import { RoleAppDTO } from "./roles";

export interface UserAppDTO {
    matricule: string;
    firstName: string;
    lastName: string;
    cin: string;
    activated: boolean;
    sexe: boolean;
    birthDate: string | null; // ISO string preferred for transport
    haringDate: string | null;
    collabortorType: string | null;
    collaboratorsStatus: string | null;
    score: number | null;
    children: UserAppDTO[];
    email: string;
    roles: RoleAppDTO[];
    }