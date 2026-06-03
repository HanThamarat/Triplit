"use client";

import { Suspense } from "react";
import AuthMain from "./contents/main-content";
 

export default function AuthPage() {  
  return (
    <Suspense>
      <AuthMain />
    </Suspense>
  );
}