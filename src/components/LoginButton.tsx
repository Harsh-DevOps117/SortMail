"use client";

import { signIn } from "next-auth/react";

export default function LoginButton() {
  return (
    <button 
      onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
      className="inline-flex h-12 md:h-14 items-center justify-center bg-[#ff3300] px-6 md:px-8 font-medium text-white hover:bg-[#e62e00] transition-colors rounded-sm shadow-sm"
    >
      <span className="font-semibold tracking-widest text-xs md:text-sm uppercase">Login with Google</span>
    </button>
  );
}
