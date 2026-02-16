import React from 'react';
import { motion } from 'framer-motion';
import { useScroll, useTransform } from 'framer-motion';
import Button from './ui/Button';

const HeroSection: React.FC = () => {
  const { scrollY } = useScroll();
  
  // Shuttlecock animation based on scroll
  const shuttlecockX = useTransform(scrollY, [0, 1000], [-100, 100]);
  const shuttlecockY = useTransform(scrollY, [0, 1000], [0, -200]);
  const shuttlecockRotation = useTransform(scrollY, [0, 1000], [0, 360]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Player Silhouettes */}
      <div className="absolute left-10 top-1/2 -translate-y-1/2 z-10">
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-8xl"
        >
          🏸
        </motion.div>
        <div className="text-neon-cyan text-center mt-2 font-bold">PLAYER A</div>
      </div>

      <div className="absolute right-10 top-1/2 -translate-y-1/2 z-10">
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-8xl"
        >
          🏸
        </motion.div>
        <div className="text-electric-purple text-center mt-2 font-bold">PLAYER B</div>
      </div>

      {/* Animated Shuttlecock */}
      <motion.div
        style={{
          x: shuttlecockX,
          y: shuttlecockY,
          rotate: shuttlecockRotation,
        }}
        className="absolute text-4xl z-20"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        🏸
      </motion.div>

      {/* Hero Content */}
      <motion.div
        className="text-center z-30 px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          variants={itemVariants}
          className="text-6xl md:text-8xl font-black mb-6"
        >
          <span className="bg-gradient-to-r from-neon-cyan via-electric-purple to-neon-cyan bg-clip-text text-transparent bg-[length:200%_100%] animate-gradient">
            NETPLAY
          </span>
        </motion.h1>
        
        <h2 className="text-2xl md:text-4xl text-gray-300 mb-4 font-bold">
          THE REAL GAME
        </h2>
        
        <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          ENTER THE ARENA • DOMINATE THE COURT • BECOME LEGEND
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="gaming"
            size="lg"
            enableGlitch={true}
            className="text-lg px-8 py-4"
          >
            ENTER BATTLE
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="text-lg px-8 py-4"
          >
            WATCH TRAILER
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-16 max-w-lg mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-neon-cyan">50K+</div>
            <div className="text-sm text-gray-400">PLAYERS</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-electric-purple">200+</div>
            <div className="text-sm text-gray-400">COURTS</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-neon-cyan">24/7</div>
            <div className="text-sm text-gray-400">BATTLE</div>
          </div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-400"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="text-2xl">↓</div>
        <div className="text-xs">SCROLL TO CONTINUE</div>
      </motion.div>
    </div>
  );
};

export default HeroSection;
