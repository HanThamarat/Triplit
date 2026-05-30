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
        <div className="h-screen w-full flex justify-center items-center">
           <div className="mx-[20px] sm:mx-auto w-[460px] rounded-[20px] px-[16px] py-[20px] bg-[#15151C] border-[#2D2C38] border flex flex-col gap-[20px]">
                <div className="flex-col gap-[5px]">
                    <span className="block font-display font-medium text-[18px] ">Sign In</span>
                    <span className="text-gray-500">Enter your email below to login to your account</span>
                </div>
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
                    label="Google"
                    icons={<FcGoogle className="text-[18px]" />}
                    onClick={signinWithGoogle}
                />
           </div>
        </div>
    );
}