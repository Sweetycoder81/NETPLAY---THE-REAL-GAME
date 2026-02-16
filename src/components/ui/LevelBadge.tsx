import React from "react";

type LevelBadgeProps = {
  level: number;
  title: string;
  className?: string;
};

const LevelBadge: React.FC<LevelBadgeProps> = ({ level, title, className = "" }) => {
  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neon-cyan/30 bg-neon-cyan/10 text-neon-cyan font-mono text-xs tracking-wider ${className}`}
    >
      <span className="font-black">LVL {level}</span>
      <span className="text-gray-200">{title.toUpperCase()}</span>
    </div>
  );
};

export default LevelBadge;
