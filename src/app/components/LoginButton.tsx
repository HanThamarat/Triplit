// src/components/LoginButton.tsx
"use html";
import { authClient } from "@/lib/auth-client";

export default function LoginButton() {
    const handleGoogleLogin = async () => {
        await authClient.signIn.social({
            provider: "google",
            callbackURL: "/dashboard", // Where to redirect after successful login
        });
    };

    return (
        <button 
            onClick={handleGoogleLogin}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
            Sign in with Google
        </button>
    );
}