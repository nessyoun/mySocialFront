// File: app/page.tsx
"use client";


import React from "react";
import SideMenu from "../shared/nav-menu/SideMenu";
import UserManagementPage from "./users-component/Users";
import { ActiveMenu } from "../shared/nav-menu/activeMenu";




export default function UsersComponent() {
return (
  <SideMenu activeMenu={ActiveMenu.Users}>
    <div className="p-4">
    <UserManagementPage></UserManagementPage>
    </div>
</SideMenu>
);
}