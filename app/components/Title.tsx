'use client';

import { ReactNode } from 'react';

interface TitleProps {
  children: ReactNode;
  subtitle?: string;
  size?: 'sm' | 'md' | 'lg';
  align?: 'left' | 'center' | 'right';
}

export default function Title({
  children,
  subtitle,
  size = 'lg',
  align = 'center',
}: TitleProps) {
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl',
  };

  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <div className={`my-6 ${alignClasses[align]}`}>
      <h1 className={`${sizeClasses[size]} font-bold text-white`}>
        {children}
      </h1>
      {subtitle && (
        <p className="mt-2 text-gray-400 text-base">{subtitle}</p>
      )}
    </div>
  );
}
