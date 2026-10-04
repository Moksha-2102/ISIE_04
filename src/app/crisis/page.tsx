"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Flame, Search, Filter, ShieldAlert, ArrowUpRight, Activity, Clock, Layers } from "lucide-react";
import { TacticalBadge } from "@/components/ui/TacticalBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonState } from "@/components/ui/SkeletonState";

export default function CrisisIntelligencePage() {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "ALL", label: "All Categories" },
    { id: "HYDRO", label: "Hydrometeorological" },
    { id: "GEO", label: "Geophysical" },
    { id: "INFRA", label: "Infrastructure & Dam" },
    { id: "RELOC", label: "Habitation Relocation" },
  ];

  return (
    <AppShell pageTitle="Crisis Intelligence // Active Incidents & Escalation Triage">
      <div className="flex-1 flex flex-col p-4 md:p-6 gap-6 max-w-7xl mx-auto w-full">
        {/* Header and Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-5 h-5 text-isie-primary" />
              <h1 className="font-mono text-xl font-bold uppercase tracking-wider text-white">
                Crisis & Incident Intelligence
              </h1>
            </div>
            <p className="text-xs text-isie-text-secondary">
              Real-time multi-hazard classification, escalation tracking, and rapid habitation risk triage.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <TacticalBadge variant="orange" size="sm">
              INCIDENT REGISTRY // READY
            </TacticalBadge>
          </div>
        </div>

        {/* Search & Category Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 max-w-md bg-isie-panel border border-white/10 px-3 py-2 rounded-sm font-mono text-xs">
            <Search className="w-4 h-4 text-isie-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by incident ID, district, or hazard code..."
              className="bg-transparent w-full text-white placeholder-isie-text-dim outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xs font-mono text-xs uppercase tracking-wider transition-colors border ${
                  activeCategory === cat.id
                    ? "bg-isie-primary/20 text-isie-primary border-isie-primary/50 font-semibold"
                    : "bg-isie-panel border-white/10 text-isie-text-muted hover:text-white hover:bg-white/5"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Triage View Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-w-0">
          {/* Left: Incident Feed (Empty state) */}
          <div className="lg:col-span-1 min-w-0 p-4 bg-isie-panel border border-white/10 rounded-sm flex flex-col justify-between min-h-[420px]">
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-white">
                  Incoming Incident Stream
                </span>
                <TacticalBadge variant="muted" size="sm">
                  0 ACTIVE
                </TacticalBadge>
              </div>

              <EmptyState
                compact
                icon="shield"
                title="No Active Crises Logged"
                description="Live crisis telemetry from state disaster monitoring networks has not reported any acute threshold breaches."
                statusText="SYSTEM IDLE"
              />
            </div>

            <div className="pt-3 border-t border-white/10 text-[10px] font-mono text-isie-text-dim flex justify-between">
              <span>BUFFER LATENCY: 0MS</span>
              <span>FILTER: {activeCategory}</span>
            </div>
          </div>

          {/* Right: Incident Detail & Escalation Inspector Container */}
          <div className="lg:col-span-2 min-w-0 p-4 sm:p-5 bg-isie-panel border border-white/10 rounded-sm min-h-[420px] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-white">
                  Crisis Detail & Escalation Inspector
                </span>
                <TacticalBadge variant="muted" size="sm">
                  NO SELECTION
                </TacticalBadge>
              </div>

              <EmptyState
                icon="radio"
                title="Select an Incident to Inspect Evidence & Escalation Risk"
                description="When an active crisis event is selected, this module displays multi-source evidence, satellite verification layers, population at risk, carrying capacity metrics, and designated evacuation corridors."
                statusText="AWAITING SELECTION"
                actionText="EXPLORE GEOSPATIAL MAP"
                actionHref="/geospatial"
              />
            </div>

            <div className="mt-6 pt-3 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[10px] text-isie-text-dim">
              <div>HAZARD RED-ZONE: --</div>
              <div>POPULATION AT RISK: --</div>
              <div>ESCALATION TREND: --</div>
              <div>EVIDENCE CHAIN: 0 SOURCES</div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
