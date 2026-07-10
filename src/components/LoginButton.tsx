"use client";

import { signIn } from "next-auth/react";

export default function LoginButton({ variant = "default", className = "" }: { variant?: "default" | "white", className?: string }) {
  const baseClasses = "inline-flex h-12 md:h-14 items-center justify-center px-6 md:px-8 font-medium transition-colors rounded-sm shadow-sm";
  
  const variants = {
    default: "bg-[#ff3300] text-white hover:bg-[#e62e00]",
    white: "bg-white text-[#ff3300] hover:bg-neutral-100",
  };

  return (
    <button 
      onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      <span className="font-bold tracking-widest text-xs md:text-sm uppercase">Login with Google</span>
    </button>
  );
}
