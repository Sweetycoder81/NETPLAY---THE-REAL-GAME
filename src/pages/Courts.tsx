import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courtsAPI } from '../api';
import { Court } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';

const Courts: React.FC = () => {
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lfgMap, setLfgMap] = useState<Record<string, boolean>>(() => {
    try {
      const raw = localStorage.getItem('lfgMap');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    fetchCourts();
  }, []);

  const fetchCourts = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await courtsAPI.getAll();
      const data = response?.data;

      const normalized: Court[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.courts)
          ? data.courts
          : Array.isArray(data?.data)
            ? data.data
            : [];

      setCourts(normalized);
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Failed to load courts';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const toggleLfg = (courtId: string) => {
    setLfgMap((prev) => {
      const next = { ...prev, [courtId]: !prev[courtId] };
      try {
        localStorage.setItem('lfgMap', JSON.stringify(next));
      } catch {
        // noop
      }
      return next;
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Spinner label="SCANNING BATTLEFIELDS" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <p className="text-red-400 mb-4 font-mono tracking-wider">{error}</p>
        <Button variant="gaming" enableGlitch={true} onClick={fetchCourts}>
          RETRY SCAN
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">BATTLEFIELDS</h1>
          <p className="text-sm text-gray-400 font-mono tracking-wider">// /api/courts</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <select className="glass-card-2 px-4 py-2 text-white border border-white/10 rounded-lg font-mono text-sm">
            <option>ALL TYPES</option>
            <option>TENNIS</option>
            <option>BASKETBALL</option>
            <option>BADMINTON</option>
          </select>
          <select className="glass-card-2 px-4 py-2 text-white border border-white/10 rounded-lg font-mono text-sm">
            <option>ALL LOCATIONS</option>
            <option>DOWNTOWN</option>
            <option>UPTOWN</option>
            <option>SUBURBS</option>
          </select>
        </div>
      </div>

      <div className="isometric-stage">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courts.map((court) => (
            <div key={court._id} className="iso-tile">
              <Card enableNeonBorder={true} interactive={true} className="p-6">
                <div className="space-y-4">
                  <div className="h-40 bg-gradient-to-br from-neon-cyan/15 to-electric-purple/15 rounded-lg flex items-center justify-center border border-white/10">
                    <span className="text-4xl">🏟️</span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{court.name}</h3>
                    {lfgMap[court._id] && (
                      <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full border border-neon-cyan/40 bg-neon-cyan/10 text-neon-cyan text-[10px] font-mono tracking-wider">
                        <span className="neon-pulse">JOIN BATTLE</span>
                        <span className="text-gray-400">LFG</span>
                      </div>
                    )}
                    <p className="text-gray-400 text-xs font-mono tracking-wider mb-2">
                      {court.type} • {court.location}
                    </p>
                    <p className="text-2xl font-black text-neon-cyan">
                      ${court.price_per_hour}/HR
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {(court.amenities || []).slice(0, 3).map((amenity, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-white/5 text-[10px] text-gray-300 rounded-full font-mono tracking-wider border border-white/10"
                      >
                        {String(amenity).toUpperCase()}
                      </span>
                    ))}
                  </div>

                  <Link to={`/courts/${court._id}`}>
                    <Button variant="gaming" enableGlitch={true} className="w-full">
                      DEPLOY
                    </Button>
                  </Link>

                  <Button
                    variant={lfgMap[court._id] ? 'outline' : 'secondary'}
                    onClick={() => toggleLfg(court._id)}
                    className="w-full"
                  >
                    {lfgMap[court._id] ? 'LFG: ON' : 'LFG: OFF'}
                  </Button>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {courts.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-300 font-mono tracking-wider mb-3">NO BATTLEFIELDS ONLINE</p>
          <p className="text-gray-500 text-sm mb-6">Check your backend at <span className="text-gray-400">REACT_APP_API_URL</span></p>
          <Button variant="gaming" enableGlitch={true} onClick={fetchCourts}>
            RESCAN
          </Button>
        </div>
      )}
    </div>
  );
};

export default Courts;
