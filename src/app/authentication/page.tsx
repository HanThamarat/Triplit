"use client"

import Input from "@/app/components/content-input/input";
import ButtonComponent from "@/app/components/content-button/defualt-btn";
import OutlineButtonComponent from "@/app/components/content-button/outlile-btn";
import Divider from "@/app/components/content-line/divider";
import { FcGoogle } from "react-icons/fc";
import { authClient } from "@/lib/auth-client";

export default function AuthPage() {

    const signinWithGoogle = async () => {
        await authClient.signIn.social({
            provider: "google",
            callbackURL: "/dashboard"
        });
    }

    return(
        <div className="h-screen w-full flex justify-center items-center bg-pearl dark:bg-obsidian relative overflow-hidden aurora-mesh animate-aurora noise-overlay">
            {/* Background Decorations */}
            <div className="absolute inset-0 grid-overlay opacity-30 pointer-events-none" />
            <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" />
            
            {/* Glow Orbs */}
            <div className="absolute -top-[10%] -left-[10%] w-[45%] h-[45%] bg-gold/10 rounded-full blur-[100px] animate-float-slow pointer-events-none" />
            <div className="absolute -bottom-[10%] -right-[10%] w-[45%] h-[45%] bg-blue-primary/10 rounded-full blur-[100px] animate-float pointer-events-none" />

           <div className="relative z-10 mx-[20px] sm:mx-auto w-[460px] rounded-[24px] px-[24px] py-[32px] bg-white/80 dark:bg-obsidian-card/90 backdrop-blur-xl border-pearl-border dark:border-obsidian-border border shadow-2xl animate-card-enter">
                <div className="flex flex-col gap-[8px] mb-[28px]">
                    <span className="block font-display font-extrabold text-[24px] text-slate-900 dark:text-stone-50 tracking-tight">Welcome Back</span>
                    <span className="text-[14px] text-pearl-muted dark:text-obsidian-muted font-medium">Log in to your Triplit account to continue your journey</span>
                </div>
                <div className="flex flex-col gap-[20px]">
                    <Input
                        label="Email"
                        placholder="Enter your email"
                    />
                    <Input
                        label="Password"
                        placholder="Enter your password"
                        isPassword
                    />
                    <ButtonComponent
                        label="Sign In"
                    />
                    <Divider label="or" />
                    <OutlineButtonComponent
                        label="Continue with Google"
                        icons={<FcGoogle className="text-[20px]" />}
                        onClick={signinWithGoogle}
                    />
                </div>
           </div>
        </div>
    );
}