import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  enableNeonBorder?: boolean;
  interactive?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  enableNeonBorder = false,
  interactive = false 
}) => {
  const cardClasses = enableNeonBorder 
    ? 'glass-card-2 relative overflow-hidden'
    : 'glass-card';

  const MotionCard = motion.div;

  return (
    <MotionCard
      className={`${cardClasses} ${className} ${interactive ? 'hover:scale-105 hover:backdrop-blur-xl' : ''}`}
      whileHover={interactive ? { scale: 1.05 } : {}}
      transition={{ duration: 0.3 }}
    >
      {enableNeonBorder && (
        <>
          <div className="absolute inset-0 rounded-lg">
            <div className="absolute inset-0 rounded-lg border-2 border-transparent bg-gradient-to-r from-neon-cyan via-electric-purple to-neon-cyan bg-[length:200%_100%] animate-borderBeam" />
          </div>
          <div className="absolute inset-0 rounded-lg border-2 border-white/10" />
        </>
      )}
      <div className="relative z-10">
        {children}
      </div>
    </MotionCard>
  );
};

export default Card;
