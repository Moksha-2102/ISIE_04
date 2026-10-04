"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { AppShell } from "@/components/layout/AppShell";
import { Map2DView } from "@/components/visuals/Map2DView";
import { MapModeSwitcher, MapDisplayMode } from "@/components/visuals/MapModeSwitcher";
import { TacticalBadge } from "@/components/ui/TacticalBadge";
import { Layers, MapPin, Eye, Satellite, ShieldAlert, Sliders, Maximize2 } from "lucide-react";
import { DEFAULT_MAP_LAYERS } from "@/lib/constants/tacticalLayers";
import { useAuth } from "@/lib/auth/AuthContext";
import { incidentService } from "@/lib/services/incidentService";
import { IntelligenceEvent } from "@/lib/types/isie";

import { SafeGlobal3DView as Global3DView } from "@/components/visuals/SafeGlobal3DView";

export default function GeospatialIntelligencePage() {
  const { isDemoMode } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [incidents, setIncidents] = useState<IntelligenceEvent[]>([]);
  const [mapMode, setMapMode] = useState<MapDisplayMode>("2D_MAP");
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  const [activeLayers, setActiveLayers] = useState<Record<string, boolean>>({
    "layer-red-zones": true,
    "layer-cwc-hydrology": true,
    "layer-carrying-capacity": true,
  });

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    const unsubscribe = incidentService.subscribeIncidents(isDemoMode, (data) => {
      setIncidents(data);
    });
    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, [isDemoMode]);

  const toggleLayer = (layerId: string) => {
    setActiveLayers((prev) => ({
      ...prev,
      [layerId]: !prev[layerId],
    }));
  };

  return (
    <AppShell pageTitle="Geospatial Intelligence // Satellite, GIS & Terrain Fusion">
      <div className="flex-1 flex flex-col lg:flex-row h-full min-h-0 overflow-y-auto lg:overflow-hidden">
        {/* Main Geospatial Viewport */}
        <div className="flex-1 flex flex-col min-h-[400px] lg:min-h-0 h-[420px] sm:h-[480px] lg:h-full min-w-0 bg-isie-bg-deep relative">
          {/* Top View Mode Switcher Header */}
          <div className="h-12 px-3 sm:px-4 border-b border-white/10 bg-isie-panel/90 backdrop-blur-md flex items-center justify-between z-10 shrink-0">
            <div className="flex items-center gap-3">
              <MapModeSwitcher mode={mapMode} onChange={setMapMode} />
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <TacticalBadge variant="cyan" size="sm">
                WGS-84
              </TacticalBadge>
              <div className="hidden sm:flex items-center gap-1.5 font-mono text-xs text-isie-text-muted">
                <Satellite className="w-3.5 h-3.5 text-amber-400" />
                <span>SENTINEL-1 SAR: READY</span>
              </div>
            </div>
          </div>

          {/* Interactive Map View */}
          <div className="flex-1 min-h-0 relative overflow-hidden">
            {!mounted ? (
              <div className="w-full h-full min-h-[360px] bg-isie-bg-deep flex flex-col items-center justify-center font-mono text-xs text-isie-cyan/70 gap-2.5">
                <div className="w-7 h-7 rounded-full border-2 border-isie-cyan border-t-transparent animate-spin" />
                <span className="tracking-widest uppercase animate-pulse">INITIALIZING SPATIAL ENGINE...</span>
              </div>
            ) : (
              <>
                {mapMode === "2D_MAP" && (
                  <Map2DView
                    incidents={incidents}
                    selectedIncidentId={selectedIncidentId}
                    onSelectIncident={(inc) => setSelectedIncidentId(inc?.id || null)}
                  />
                )}
                {mapMode === "3D_GLOBE" && (
                  <Global3DView
                    incidents={incidents}
                    selectedIncidentId={selectedIncidentId}
                    onSelectIncident={(inc) => setSelectedIncidentId(inc?.id || null)}
                  />
                )}
                {mapMode === "SPLIT_VIEW" && (
                  <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10">
                    <div className="relative h-full min-h-0">
                      <Global3DView
                        incidents={incidents}
                        showOverlay={false}
                        selectedIncidentId={selectedIncidentId}
                        onSelectIncident={(inc) => setSelectedIncidentId(inc?.id || null)}
                      />
                    </div>
                    <div className="relative h-full min-h-0">
                      <Map2DView
                        incidents={incidents}
                        selectedIncidentId={selectedIncidentId}
                        onSelectIncident={(inc) => setSelectedIncidentId(inc?.id || null)}
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Right Sidebar: Tactical GIS Layer & Spatial Filter Manager */}
        <div className="w-full lg:w-80 2xl:w-84 h-auto lg:h-full min-h-[300px] lg:min-h-0 bg-isie-panel border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col shrink-0 min-w-0 select-none">
          <div className="p-3.5 border-b border-white/10 bg-isie-panel-light/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-isie-cyan" />
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-white">
                Spatial Layers & Telemetry
              </span>
            </div>
            <TacticalBadge variant="muted" size="sm">
              {DEFAULT_MAP_LAYERS.length} LAYERS
            </TacticalBadge>
          </div>

          {/* Layer List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {DEFAULT_MAP_LAYERS.map((layer) => {
              const isEnabled = activeLayers[layer.id];

              return (
                <div
                  key={layer.id}
                  onClick={() => toggleLayer(layer.id)}
                  className={`p-3 rounded-xs border cursor-pointer transition-all ${
                    isEnabled
                      ? "bg-sky-950/20 border-sky-500/30 text-white"
                      : "bg-white/[0.02] border-white/5 text-isie-text-muted hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-semibold tracking-wide">
                      {layer.name}
                    </span>
                    <Eye
                      className={`w-4 h-4 ${
                        isEnabled ? "text-isie-cyan" : "text-white/20"
                      }`}
                    />
                  </div>
                  <p className="text-[11px] text-isie-text-dim leading-relaxed mb-2">
                    {layer.description}
                  </p>
                  <div className="flex items-center justify-between font-mono text-[9px] text-isie-text-muted">
                    <span>{layer.sourceProvider}</span>
                    <span className="text-isie-cyan">{layer.latencySpec}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Satellite Telemetry Status */}
          <div className="p-3 border-t border-white/10 bg-isie-panel-light/20 text-[10px] font-mono text-isie-text-dim flex justify-between">
            <span>RASTER/VECTOR FUSION: ACTIVE</span>
            <span>POLYGONS: 0</span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
