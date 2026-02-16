import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'gaming';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  enableGlitch?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '', 
  enableGlitch = false,
  ...props 
}) => {
  const baseClasses = 'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 relative overflow-hidden';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-neon-cyan to-electric-purple text-white hover:opacity-90 focus:ring-neon-cyan',
    secondary: 'bg-white/10 text-white border border-white/20 hover:bg-white/20 focus:ring-white',
    outline: 'border border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-dark-bg focus:ring-neon-cyan',
    gaming: 'bg-black/50 text-neon-cyan border-2 border-neon-cyan/50 hover:border-neon-cyan hover:shadow-[0_0_20px_rgba(0,243,255,0.5)] focus:ring-neon-cyan',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const glitchText = enableGlitch ? 'glitch' : '';
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${variant === 'gaming' ? 'pulse-glow' : ''}`}
      {...props}
    >
      <span className={glitchText} data-text={typeof children === 'string' ? children : ''}>
        {children}
      </span>
      {variant === 'gaming' && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-cyan/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />
      )}
    </button>
  );
};

export default Button;
