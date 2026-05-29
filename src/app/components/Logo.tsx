"use client";

import Image from "next/image";

interface LogoProps {
  size?: number;
  className?: string;
}

export default function Logo({ size = 36, className = "" }: LogoProps) {
  return (
    <Image
      src="/icon.svg"
      alt="Triplit Logo"
      width={size}
      height={size}
      className={`rounded-lg shadow-lg shadow-gold/15 ${className}`}
      priority
    />
  );
}
