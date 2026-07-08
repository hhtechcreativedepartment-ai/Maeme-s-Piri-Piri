import React from 'react';

interface BrandButtonProps {
  variant?: 'primary' | 'secondary' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export default function BrandButton({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: BrandButtonProps) {
  const baseStyles = 'font-medium transition-colors duration-200';
  
  const variants = {
    primary: 'bg-[#8B2E3B] text-white hover:bg-[#6B1F2C]',
    secondary: 'bg-white text-[#8B2E3B] border border-[#E5E5E5] hover:bg-[#F8F8F8]',
    gold: 'bg-[#B8860B] text-white hover:bg-[#9A7109]',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-3 text-base',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
