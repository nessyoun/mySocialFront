import { PermissionsDTO } from "./permissions";

export interface RoleAppDTO {
    id: number;
    name: string;
    permissions: PermissionsDTO[]
}