import React, { useMemo, useState } from "react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

type LocationOption = {
  id: string;
  name: string;
};

type TurfBox = {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  address: string;
  tags: string[];
};

const NearMe: React.FC = () => {
  const locations: LocationOption[] = useMemo(
    () => [
      { id: "surat", name: "Surat" },
      { id: "ahmedabad", name: "Ahmedabad" },
      { id: "mumbai", name: "Mumbai" },
    ],
    []
  );

  const [locationId, setLocationId] = useState(locations[0].id);

  const turfs: TurfBox[] = useMemo(
    () => [
      {
        id: "t1",
        name: "AJ Sports",
        rating: 4.8,
        reviews: 220,
        address: "Shop No. 22 Raj Empire, Godadara, Surat",
        tags: ["Sports Club", "Coaching"],
      },
      {
        id: "t2",
        name: "Sk Cricket Academy",
        rating: 4.8,
        reviews: 177,
        address: "Mansarovar Road, Godadara, Surat",
        tags: ["Sports Club", "Cricket"],
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">NEAR ME</h1>
          <p className="text-sm text-gray-400 font-mono tracking-wider">// map view placeholder</p>
        </div>
        <select
          value={locationId}
          onChange={(e) => setLocationId(e.target.value)}
          className="glass-card-2 px-4 py-2 text-white border border-white/10 rounded-lg font-mono text-sm"
        >
          {locations.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      <Card enableNeonBorder={true} className="p-4 bg-slate-900/60 border border-neon-cyan/15">
        <div className="h-[260px] rounded-xl bg-slate-950/60 border border-white/10 shadow-[0_0_40px_rgba(0,243,255,0.12)] flex items-center justify-center">
          <div className="text-center">
            <div className="text-neon-cyan font-mono tracking-wider">MAP VIEW</div>
            <div className="text-gray-500 text-sm mt-1">Selected: {locationId.toUpperCase()}</div>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        {turfs.map((t) => (
          <Card
            key={t.id}
            enableNeonBorder={true}
            interactive={true}
            className="p-4 bg-slate-900/60 border border-neon-cyan/15 shadow-[0_0_36px_rgba(0,243,255,0.10)]"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-3">
                <div className="h-36 rounded-xl bg-slate-950/50 border border-white/10 shadow-[0_0_30px_rgba(112,0,255,0.10)]" />
              </div>
              <div className="md:col-span-6">
                <div className="flex items-center gap-3">
                  <div className="text-xl font-black text-white">{t.name}</div>
                  <div className="px-2 py-1 rounded-md bg-green-500/15 text-green-400 border border-green-500/30 text-xs font-mono">
                    {t.rating.toFixed(1)} ★
                  </div>
                  <div className="text-xs text-gray-400 font-mono">{t.reviews} Ratings</div>
                </div>

                <div className="mt-2 text-gray-300 text-sm">📍 {t.address}</div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {t.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-gray-200 font-mono tracking-wider"
                    >
                      {tag.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>

              <div className="md:col-span-3 flex md:flex-col gap-2 md:items-stretch items-center justify-end">
                <Button variant="gaming" enableGlitch={true} className="w-full">
                  SHOW NUMBER
                </Button>
                <Button variant="secondary" className="w-full">
                  WHATSAPP
                </Button>
                <Button variant="outline" className="w-full">
                  SEND ENQUIRY
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default NearMe;
