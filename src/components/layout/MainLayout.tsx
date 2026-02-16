import React, { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HomeIcon, 
  CalendarIcon, 
  UserCircleIcon,
  TrophyIcon 
} from '@heroicons/react/24/outline';
import { useMousePosition } from '../../hooks/useMousePosition';
import { useNavBeep } from '../../hooks/useNavBeep';
import LobbyPanel from '../social/LobbyPanel';
import LevelBadge from '../ui/LevelBadge';
import { getRankFromExp } from '../../utils/leveling';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const mousePosition = useMousePosition();
  const { beep } = useNavBeep();
  const [lobbyOpen, setLobbyOpen] = useState(false);

  const player = useMemo(() => {
    const raw = localStorage.getItem('user');
    const parsed = raw ? JSON.parse(raw) : null;
    const name = parsed?.name || parsed?.email || 'PLAYER_01';
    // If you want to persist EXP later, store it in localStorage. For now fallback to 0.
    const exp = Number(localStorage.getItem('exp') || 0);
    return { name, exp };
  }, []);

  const rank = useMemo(() => getRankFromExp(player.exp), [player.exp]);
  
  const navigation = [
    { name: 'COMMAND', href: '/', icon: HomeIcon },
    { name: 'BATTLEFIELDS', href: '/courts', icon: CalendarIcon },
    { name: 'PROFILE', href: '/dashboard', icon: UserCircleIcon },
    { name: 'TOURNAMENTS', href: '/tournaments', icon: TrophyIcon },
  ];
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="min-h-screen bg-dark-bg text-white relative overflow-hidden">
      {/* Animated Background Gradient */}
      <div 
        className="fixed inset-0 opacity-30 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(0, 243, 255, 0.2) 0%, rgba(112, 0, 255, 0.1) 25%, transparent 50%)`,
        }}
      />

      {/* Gaming HUD Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 glass-card-2 border-r border-neon-cyan/20 z-40">
        <div className="p-6 border-b border-white/10">
          <motion.h1 
            className="text-2xl font-black bg-gradient-to-r from-neon-cyan to-electric-purple bg-clip-text text-transparent"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            NETPLAY
          </motion.h1>
          <motion.p 
            className="text-xs text-gray-400 mt-1 font-mono tracking-widest"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* // THE REAL GAME */}
            THE REAL GAME
          </motion.p>
        </div>
        
        <nav className="mt-8 px-4">
          {navigation.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link
                  to={item.href}
                  onMouseEnter={() => beep({ frequency: isActive(item.href) ? 660 : 880, durationMs: 35 })}
                  className={`
                    flex items-center px-4 py-3 mb-2 rounded-lg transition-all duration-200 font-mono text-sm tracking-wider
                    ${isActive(item.href) 
                      ? 'bg-gradient-to-r from-neon-cyan/20 to-electric-purple/20 text-neon-cyan border-l-2 border-neon-cyan shadow-[0_0_20px_rgba(0,243,255,0.3)] neon-pulse' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white hover:border-l-2 hover:border-white/20'
                    }
                  `}
                >
                  <Icon className="w-4 h-4 mr-3" />
                  <span>{item.name}</span>
                  {isActive(item.href) && (
                    <motion.div
                      className="ml-auto w-2 h-2 bg-neon-cyan rounded-full"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* System Status */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <div className="text-xs font-mono text-gray-400">
            <div className="flex justify-between mb-1">
              <span>SYSTEM:</span>
              <span className="text-neon-cyan">ONLINE</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>PING:</span>
              <span className="text-electric-purple">12ms</span>
            </div>
            <div className="flex justify-between">
              <span>STATUS:</span>
              <span className="text-green-400">READY</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="ml-64 relative z-30">
        {/* Enhanced Top Bar */}
        <div className="glass-card-2 border-b border-neon-cyan/20 px-8 py-4">
          <div className="flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl font-bold text-white font-mono tracking-wider">
                {'> ' + (navigation.find(item => item.href === location.pathname)?.name || 'NETPLAY')}
              </h2>
              <p className="text-xs text-gray-400 font-mono mt-1">
                {/* // Initialize battle sequence */}
                Initialize battle sequence
              </p>
            </motion.div>
            
            <motion.div 
              className="flex items-center space-x-6"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <button
                onMouseEnter={() => beep({ frequency: 990, durationMs: 30 })}
                onClick={() => setLobbyOpen(true)}
                className="text-gray-400 hover:text-neon-cyan transition-colors font-mono text-sm"
              >
                [LOBBY]
              </button>
              <button className="text-gray-400 hover:text-neon-cyan transition-colors font-mono text-sm">
                [ALERTS]
              </button>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-xs text-gray-400 font-mono">{String(player.name).toUpperCase()}</div>
                  <div className="mt-1 flex justify-end">
                    <LevelBadge level={rank.level} title={rank.title} />
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-neon-cyan to-electric-purple flex items-center justify-center border-2 border-neon-cyan/50">
                  <span className="text-sm font-bold text-white">P1</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Page Content with Enhanced Styling */}
        <main className="p-8 main-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        </main>
      </div>

      <LobbyPanel
        open={lobbyOpen}
        onClose={() => setLobbyOpen(false)}
        playerName={player.name}
        playerExp={player.exp}
      />
    </div>
  );
};

export default MainLayout;
