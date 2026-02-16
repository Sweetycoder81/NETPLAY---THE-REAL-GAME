import React from "react";

type SpinnerProps = {
  label?: string;
};

const Spinner: React.FC<SpinnerProps> = ({ label }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-2 border-white/10" />
        <div className="absolute inset-0 h-16 w-16 rounded-full border-2 border-neon-cyan border-t-transparent animate-spin shadow-[0_0_30px_rgba(0,243,255,0.35)]" />
        <div className="absolute inset-2 h-12 w-12 rounded-full border-2 border-electric-purple/70 border-b-transparent animate-spin [animation-duration:1.4s]" />
      </div>
      {label ? (
        <div className="text-sm font-mono tracking-widest text-neon-cyan/90">
          {label}
        </div>
      ) : null}
    </div>
  );
};

export default Spinner;
