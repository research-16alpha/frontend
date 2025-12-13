import React from 'react';

export interface PromoBannerProps {
  title: string;
  subtitle?: string;
  description?: string;
  backgroundColor?: string;
  textColor?: string;
  className?: string;
}

export function PromoBanner({
  title,
  subtitle,
  description,
  backgroundColor = '#f5e6e0',
  textColor = '#000',
  className = ''
}: PromoBannerProps) {
  return (
    <div 
      className={`p-8 flex flex-col justify-center items-center text-center ${className}`}
      style={{ backgroundColor, color: textColor }}
    >
      <h2 className="text-2xl md:text-3xl mb-2">{title}</h2>
      {subtitle && (
        <p className="text-lg mb-3">{subtitle}</p>
      )}
      {description && (
        <p className="text-sm max-w-xs">{description}</p>
      )}
    </div>
  );
}
