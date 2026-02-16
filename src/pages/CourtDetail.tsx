import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { courtsAPI, bookingsAPI } from '../api';
import { Court, TimeSlot } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const CourtDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [court, setCourt] = useState<Court | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    if (id) fetchCourt(id);
  }, [id]);

  const fetchCourt = async (courtId: string) => {
    try {
      const response = await courtsAPI.getById(courtId);
      setCourt(response.data);
    } catch (error) {
      console.error('Failed to fetch court:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!court || !selectedSlot || !selectedDate) return;

    setBookingLoading(true);
    try {
      await bookingsAPI.create({
        court_id: court._id,
        date: selectedDate,
        time_slot: selectedSlot,
        total_price: court.price_per_hour,
      });
      alert('Booking successful!');
      setSelectedSlot(null);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-neon-cyan">Loading court details...</div>
      </div>
    );
  }

  if (!court) {
    return (
      <div className="text-center">
        <p className="text-red-500">Court not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Court Header */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="h-64 bg-gradient-to-br from-neon-cyan/20 to-electric-purple/20 rounded-lg flex items-center justify-center mb-6">
            <span className="text-6xl">🏟️</span>
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-white">{court.name}</h1>
          <p className="text-gray-400">{court.type}</p>
          <p className="text-gray-400">📍 {court.location}</p>
          <p className="text-3xl font-bold text-neon-cyan">
            ${court.price_per_hour}/hour
          </p>
          
          <div className="flex flex-wrap gap-2">
            {court.amenities.map((amenity, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-white/10 text-gray-300 rounded-full"
              >
                {amenity}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Booking Section */}
      <Card>
        <h2 className="text-2xl font-bold text-white mb-6">Book This Court</h2>
        
        <div className="space-y-6">
          {/* Date Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-cyan"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Time Slots */}
          {selectedDate && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Available Time Slots</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {court.available_slots
                  .filter(slot => slot.available)
                  .map((slot, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedSlot(slot)}
                      className={`
                        p-3 rounded-lg border transition-all duration-200
                        ${selectedSlot === slot
                          ? 'border-neon-cyan bg-neon-cyan/20 text-neon-cyan'
                          : 'border-white/20 bg-white/10 text-gray-300 hover:border-white/40'
                        }
                      `}
                    >
                      <div className="text-sm font-medium">
                        {slot.start_time} - {slot.end_time}
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* Booking Summary */}
          {selectedSlot && (
            <Card className="bg-gradient-to-r from-neon-cyan/10 to-electric-purple/10">
              <h3 className="text-lg font-semibold text-white mb-3">Booking Summary</h3>
              <div className="space-y-2 text-gray-300">
                <p>Date: {new Date(selectedDate).toLocaleDateString()}</p>
                <p>Time: {selectedSlot.start_time} - {selectedSlot.end_time}</p>
                <p>Duration: 1 hour</p>
                <p className="text-xl font-bold text-neon-cyan">
                  Total: ${court.price_per_hour}
                </p>
              </div>
              <Button
                onClick={handleBooking}
                disabled={bookingLoading}
                className="w-full mt-4"
              >
                {bookingLoading ? 'Booking...' : 'Confirm Booking'}
              </Button>
            </Card>
          )}
        </div>
      </Card>
    </div>
  );
};

export default CourtDetail;
