"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { AppShell } from "@/components/layout/AppShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { TacticalBadge } from "@/components/ui/TacticalBadge";
import { Globe2, Radio, Compass, Shield, MapPin, AlertCircle } from "lucide-react";

import { SafeGlobal3DView as Global3DView } from "@/components/visuals/SafeGlobal3DView";

export default function GlobalSituationPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("ALL");

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const regions = [
    { id: "ALL", name: "Global Composite View", count: 0 },
    { id: "HIM", name: "Himalayan Glacial Belt", count: 0 },
    { id: "NOR", name: "Northern River Basins", count: 0 },
    { id: "CST", name: "Coastal Surge Corridors", count: 0 },
    { id: "PEN", name: "Peninsular Catchment Areas", count: 0 },
    { id: "SEA", name: "South & Southeast Asia Transboundary", count: 0 },
  ];

  return (
    <AppShell pageTitle="Global Situation // Macro Environmental Telemetry">
      <div className="flex-1 flex flex-col p-4 md:p-6 gap-6 max-w-7xl mx-auto w-full">
        {/* Top Header & Regional Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Globe2 className="w-5 h-5 text-isie-cyan" />
              <h1 className="font-mono text-xl font-bold uppercase tracking-wider text-white">
                Global Operating Environment
              </h1>
            </div>
            <p className="text-xs text-isie-text-secondary">
              Strategic transboundary monitoring, macro meteorological phenomena, and multi-region correlation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <TacticalBadge variant="cyan" size="sm" pulse>
              SYNOPTIC SCAN: STANDBY
            </TacticalBadge>
          </div>
        </div>

        {/* Region Selector Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {regions.map((reg) => (
            <button
              key={reg.id}
              onClick={() => setSelectedRegion(reg.id)}
              className={`px-3 py-1.5 rounded-xs font-mono text-xs uppercase tracking-wider transition-colors border ${
                selectedRegion === reg.id
                  ? "bg-isie-primary/20 text-isie-primary border-isie-primary/50 font-semibold"
                  : "bg-isie-panel border-white/10 text-isie-text-muted hover:text-white hover:bg-white/5"
              }`}
            >
              {reg.name}
            </button>
          ))}
        </div>

        {/* Main 3D Global Space */}
        <div className="h-[340px] sm:h-[460px] w-full rounded-sm border border-white/10 relative overflow-hidden bg-isie-bg-deep shadow-2xl min-w-0">
          {mounted ? (
            <Global3DView />
          ) : (
            <div className="w-full h-full min-h-[320px] bg-isie-bg-deep flex items-center justify-center font-mono text-xs text-isie-cyan/60 animate-pulse">
              INITIALIZING 3D SPATIAL ENGINE...
            </div>
          )}
        </div>

        {/* Regional Situation Grids */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-w-0">
          <div className="p-4 bg-isie-panel border border-white/10 rounded-sm min-w-0 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs uppercase tracking-wider text-white font-semibold">
                Emerging Signals Stream
              </span>
              <TacticalBadge variant="muted" size="sm">
                0 SIGNALS
              </TacticalBadge>
            </div>
            <EmptyState
              compact
              icon="radio"
              title="No Emerging Global Anomalies"
              description="Transboundary sensor feeds are awaiting connection. Planetary Doppler and thermal anomalies will stream into this feed."
              statusText="STANDBY"
            />
          </div>

          <div className="p-4 bg-isie-panel border border-white/10 rounded-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs uppercase tracking-wider text-white font-semibold">
                Cross-Region Correlation
              </span>
              <TacticalBadge variant="muted" size="sm">
                SYNCHRONIZED
              </TacticalBadge>
            </div>
            <EmptyState
              compact
              icon="database"
              title="Correlation Matrix Idle"
              description="Cross-basin hydrological dependencies and multi-state cascade impacts will compute once active hazards are detected."
              statusText="STANDBY"
            />
          </div>

          <div className="p-4 bg-isie-panel border border-white/10 rounded-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs uppercase tracking-wider text-white font-semibold">
                Global Severity Distribution
              </span>
              <TacticalBadge variant="muted" size="sm">
                0 THREATS
              </TacticalBadge>
            </div>
            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xs space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center text-red-400">
                <span>CRITICAL HAZARD NODES</span>
                <span className="font-bold">0</span>
              </div>
              <div className="flex justify-between items-center text-amber-400">
                <span>WARNING / BUFFER NODES</span>
                <span className="font-bold">0</span>
              </div>
              <div className="flex justify-between items-center text-emerald-400">
                <span>NOMINAL / SECURE BASINS</span>
                <span className="font-bold">ALL</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
