import React, { useEffect, useMemo, useState } from 'react';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';
import { bookingsAPI } from '../api';
import { Booking } from '../types';

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await bookingsAPI.getUserBookings();
      const data = res?.data;
      const normalized: Booking[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.bookings)
          ? data.bookings
          : Array.isArray(data?.data)
            ? data.data
            : [];
      setBookings(normalized);
    } catch (e: any) {
      const message = e?.response?.data?.message || e?.message || 'Failed to load player stats';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const total = bookings.length;
    const confirmed = bookings.filter((b) => (b as any)?.status === 'confirmed').length;
    const cancelled = bookings.filter((b) => (b as any)?.status === 'cancelled').length;
    const pending = bookings.filter((b) => (b as any)?.status === 'pending').length;

    const matchesPlayed = confirmed;
    const denom = confirmed + cancelled;
    const winRate = denom > 0 ? Math.round((confirmed / denom) * 100) : 0;

    const hoursPlayed = confirmed;
    const exp = confirmed * 120 + pending * 20 + total * 10;

    const byCourt: Record<string, number> = {};
    for (const b of bookings) {
      const raw = (b as any)?.court_id;
      const key = typeof raw === 'string' ? raw : raw?._id || raw?.id || 'unknown';
      byCourt[key] = (byCourt[key] || 0) + 1;
    }
    const favoriteCourtId = Object.entries(byCourt).sort((a, b) => b[1] - a[1])[0]?.[0];
    const favoriteCourtName = (() => {
      const match = bookings.find((b) => {
        const raw = (b as any)?.court_id;
        const key = typeof raw === 'string' ? raw : raw?._id || raw?.id || 'unknown';
        return key === favoriteCourtId;
      });
      const raw = (match as any)?.court_id;
      return raw?.name || raw?.title || (favoriteCourtId && favoriteCourtId !== 'unknown' ? `Court ${String(favoriteCourtId).slice(-6)}` : 'UNKNOWN');
    })();

    const nextBooking = (() => {
      const upcoming = bookings
        .map((b) => {
          const date = (b as any)?.date;
          const start = (b as any)?.time_slot?.start_time;
          const end = (b as any)?.time_slot?.end_time;
          const dt = date && start ? new Date(`${date}T${start}`) : date ? new Date(date) : null;
          return { b, dt, start, end };
        })
        .filter((x) => x.dt && !Number.isNaN(x.dt.getTime())) as { b: Booking; dt: Date; start?: string; end?: string }[];
      upcoming.sort((a, b) => a.dt.getTime() - b.dt.getTime());
      return upcoming[0] || null;
    })();

    return {
      total,
      confirmed,
      cancelled,
      pending,
      matchesPlayed,
      winRate,
      hoursPlayed,
      exp,
      favoriteCourtName,
      nextBooking,
    };
  }, [bookings]);

  useEffect(() => {
    try {
      localStorage.setItem('exp', String(stats.exp));
    } catch {
      // noop
    }
  }, [stats.exp]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Spinner label="SYNCING PLAYER STATS" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <p className="text-red-400 mb-4 font-mono tracking-wider">{error}</p>
        <Button variant="gaming" enableGlitch={true} onClick={fetchBookings}>
          RETRY SYNC
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white">PROFILE</h1>
        <p className="text-sm text-gray-400 font-mono tracking-wider">// derived from /api/bookings/my</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-white mb-2">Matches Played</h3>
          <p className="text-3xl font-black text-neon-cyan">{stats.matchesPlayed}</p>
          <p className="text-sm text-gray-400 font-mono">CONFIRMED</p>
        </Card>
        
        <Card>
          <h3 className="text-lg font-semibold text-white mb-2">Win Rate</h3>
          <p className="text-3xl font-black text-electric-purple">{stats.winRate}%</p>
          <p className="text-sm text-gray-400 font-mono">CONFIRMED VS CANCELLED</p>
        </Card>
        
        <Card>
          <h3 className="text-lg font-semibold text-white mb-2">EXP</h3>
          <p className="text-3xl font-black text-neon-cyan">{stats.exp}</p>
          <p className="text-sm text-gray-400 font-mono">XP ENGINE (BETA)</p>
        </Card>
        
        <Card>
          <h3 className="text-lg font-semibold text-white mb-2">Hours Played</h3>
          <p className="text-3xl font-black text-electric-purple">{stats.hoursPlayed}</p>
          <p className="text-sm text-gray-400 font-mono">1H PER CONFIRMED BOOKING</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-xl font-bold text-white mb-4">Recent Bookings</h2>
          <div className="space-y-3">
            {bookings.slice(0, 5).map((b) => {
              const rawCourt = (b as any)?.court_id;
              const courtName = rawCourt?.name || rawCourt?.title || (typeof rawCourt === 'string' ? `Court ${rawCourt.slice(-6)}` : 'UNKNOWN');
              const date = (b as any)?.date;
              const start = (b as any)?.time_slot?.start_time;
              const status = String((b as any)?.status || 'pending');
              const statusStyles: Record<string, string> = {
                confirmed: 'bg-green-500/15 text-green-400 border border-green-500/30',
                cancelled: 'bg-red-500/15 text-red-400 border border-red-500/30',
                pending: 'bg-yellow-500/15 text-yellow-300 border border-yellow-500/30',
              };

              return (
                <div key={(b as any)?._id || `${courtName}-${date}-${start}`} className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
                  <div>
                    <p className="text-white font-medium">{courtName}</p>
                    <p className="text-gray-400 text-sm font-mono">
                      {date ? new Date(date).toLocaleDateString() : '—'}{start ? ` • ${start}` : ''}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full font-mono tracking-wider ${statusStyles[status] || statusStyles.pending}`}>
                    {status.toUpperCase()}
                  </span>
                </div>
              );
            })}

            {bookings.length === 0 && (
              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                <p className="text-gray-400 font-mono text-sm">NO BOOKINGS YET</p>
              </div>
            )}
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-bold text-white mb-4">Loadout</h2>
          <div className="space-y-3">
            <div className="p-3 bg-white/5 rounded-lg border border-white/10">
              <p className="text-white font-medium">Favorite Battlefield</p>
              <p className="text-gray-400 text-sm font-mono">{stats.favoriteCourtName}</p>
            </div>

            <div className="p-3 bg-white/5 rounded-lg border border-white/10">
              <p className="text-white font-medium">Next Deployment</p>
              <p className="text-gray-400 text-sm font-mono">
                {stats.nextBooking?.dt ? stats.nextBooking.dt.toLocaleString() : '—'}
              </p>
            </div>

            <div className="p-3 bg-white/5 rounded-lg border border-white/10">
              <p className="text-white font-medium">Booking Queue</p>
              <p className="text-gray-400 text-sm font-mono">
                TOTAL: {stats.total} • CONF: {stats.confirmed} • PEND: {stats.pending} • CANC: {stats.cancelled}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
