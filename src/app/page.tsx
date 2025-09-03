// File: app/page.tsx
"use client";


import React from "react";
import UsersComponent from "./users/page";
import SideMenu from "./shared/nav-menu/SideMenu";
import { ActiveMenu } from "./shared/nav-menu/activeMenu";





export default function Page() {
return (
  <SideMenu activeMenu={ActiveMenu.Acceuil}></SideMenu>
);
}