import React from 'react';
import { motion } from 'framer-motion';
import HeroSection from '../components/HeroSection';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Home: React.FC = () => {
  const features = [
    {
      icon: '🎯',
      title: 'DOMINATE COURTS',
      description: 'RESERVE BATTLEFIELDS • SECURE VICTORY • CONTROL THE ARENA',
      color: 'neon-cyan'
    },
    {
      icon: '🏆',
      title: 'TOURNAMENTS',
      description: 'COMPETE FOR GLORY • CLIMB RANKINGS • BECOME CHAMPION',
      color: 'electric-purple'
    },
    {
      icon: '⚡',
      title: 'CONNECT WARRIORS',
      description: 'BUILD ALLIANCES • FORM SQUADS • RULE TOGETHER',
      color: 'neon-cyan'
    }
  ];

  return (
    <div className="main-content">
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-black mb-4">
              <span className="bg-gradient-to-r from-neon-cyan to-electric-purple bg-clip-text text-transparent">
                CHOOSE YOUR
              </span>
            </h2>
            <h3 className="text-3xl md:text-5xl font-black text-white">
              BATTLE MODE
            </h3>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <Card 
                  enableNeonBorder={true}
                  interactive={true}
                  className="p-8 text-center h-full"
                >
                  <div className="text-6xl mb-6">{feature.icon}</div>
                  <h3 className={`text-2xl font-bold mb-4 text-${feature.color}`}>
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 mb-6 font-mono text-sm tracking-wider">
                    {feature.description}
                  </p>
                  <Button 
                    variant="gaming" 
                    className="w-full"
                    enableGlitch={true}
                  >
                    ACTIVATE
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-black mb-4">
              <span className="bg-gradient-to-r from-electric-purple to-neon-cyan bg-clip-text text-transparent">
                BATTLE
              </span>
            </h2>
            <h3 className="text-3xl md:text-5xl font-black text-white">
              STATISTICS
            </h3>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '1.2M', label: 'MATCHES PLAYED' },
              { value: '89%', label: 'WIN RATE' },
              { value: '15K', label: 'ACTIVE WARRIORS' },
              { value: '500+', label: 'DAILY TOURNAMENTS' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center p-6">
                  <div className="text-3xl md:text-4xl font-black text-neon-cyan mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400 font-mono">
                    {stat.label}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="min-h-screen flex items-center justify-center px-4 py-20">
        <motion.div
          className="text-center max-w-4xl"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-black mb-6">
            <span className="bg-gradient-to-r from-neon-cyan via-electric-purple to-neon-cyan bg-clip-text text-transparent bg-[length:200%_100%] animate-gradient">
              READY TO
            </span>
          </h2>
          <h3 className="text-3xl md:text-5xl font-black text-white mb-8">
            ENTER THE ARENA?
          </h3>
          <p className="text-xl text-gray-400 mb-12 font-mono">
            THE BATTLE AWAITS • VICTORY CALLS • LEGENDS ARE BORN
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              variant="gaming"
              size="lg"
              enableGlitch={true}
              className="text-xl px-12 py-6"
            >
              START BATTLE
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-xl px-12 py-6"
            >
              TRAINING MODE
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
