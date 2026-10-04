"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Activity, ShieldAlert, Users, TrendingUp, AlertTriangle, Building, Droplets, HeartPulse } from "lucide-react";
import { TacticalBadge } from "@/components/ui/TacticalBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonState } from "@/components/ui/SkeletonState";

export default function RiskImpactAnalysisPage() {
  const [selectedDomain, setSelectedDomain] = useState<"ALL" | "CAPACITY" | "RELOCATION">("ALL");

  return (
    <AppShell pageTitle="Risk & Impact Analysis // Carrying Capacity & Vulnerability Assessment">
      <div className="flex-1 flex flex-col p-4 md:p-6 gap-6 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-5 h-5 text-isie-cyan" />
              <h1 className="font-mono text-xl font-bold uppercase tracking-wider text-white">
                Multi-Hazard Risk & Carrying Capacity Assessment
              </h1>
            </div>
            <p className="text-xs text-isie-text-secondary">
              Quantitative population exposure modeling, critical infrastructure deficits, and prioritized relocation triage.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <TacticalBadge variant="cyan" size="sm">
              ENGINE: PROBABILISTIC // READY
            </TacticalBadge>
          </div>
        </div>

        {/* Analytic Metrics Summary Cards (Structured Empty States) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
          <div className="p-4 bg-isie-panel border border-white/10 rounded-sm">
            <div className="flex items-center justify-between text-isie-text-muted mb-2">
              <span className="text-[10px] tracking-wider uppercase">HABITATIONS IN RED ZONE</span>
              <ShieldAlert className="w-4 h-4 text-red-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">0</div>
            <div className="text-[10px] text-isie-text-dim">PERIMETERS UNTRIGGERED</div>
          </div>

          <div className="p-4 bg-isie-panel border border-white/10 rounded-sm">
            <div className="flex items-center justify-between text-isie-text-muted mb-2">
              <span className="text-[10px] tracking-wider uppercase">VULNERABLE POPULATION</span>
              <Users className="w-4 h-4 text-isie-cyan" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">0</div>
            <div className="text-[10px] text-isie-text-dim">EXPOSURE RATIO: 0.00%</div>
          </div>

          <div className="p-4 bg-isie-panel border border-white/10 rounded-sm">
            <div className="flex items-center justify-between text-isie-text-muted mb-2">
              <span className="text-[10px] tracking-wider uppercase">SHELTER DEFICIT INDEX</span>
              <Building className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">NOMINAL</div>
            <div className="text-[10px] text-isie-text-dim">BUFFER AVAILABLE</div>
          </div>

          <div className="p-4 bg-isie-panel border border-white/10 rounded-sm">
            <div className="flex items-center justify-between text-isie-text-muted mb-2">
              <span className="text-[10px] tracking-wider uppercase">RELOCATION URGENCY</span>
              <AlertTriangle className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">TIER 0</div>
            <div className="text-[10px] text-isie-text-dim">NO IMMEDIATE EVACUATION</div>
          </div>
        </div>

        {/* Detailed Module 02 & Module 03 Analytics Grids */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-w-0">
          {/* Module 02: Carrying Capacity Analytics */}
          <div className="p-5 bg-isie-panel border border-white/10 rounded-sm flex flex-col justify-between min-h-[380px] min-w-0">
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                <div>
                  <div className="font-mono text-xs font-semibold uppercase tracking-wider text-white">
                    Module 02 // Carrying Capacity Stress Matrix
                  </div>
                  <div className="text-[11px] text-isie-text-dim">
                    Shelter capacity, healthcare saturation, potable water & road severance
                  </div>
                </div>
                <TacticalBadge variant="cyan" size="sm">
                  CAPACITY
                </TacticalBadge>
              </div>

              <EmptyState
                compact
                icon="shield"
                title="No Critical Capacity Breaches Logged"
                description="Carrying capacity thresholds are continuously monitored against incoming hazard perimeter vectors. Select a district to inspect local resource reserves."
                statusText="SYSTEM READY // AWAITING EVENT"
              />
            </div>

            <div className="pt-3 border-t border-white/10 font-mono text-[10px] text-isie-text-dim flex justify-between">
              <span>WATER BUFFER: STANDBY</span>
              <span>HEALTHCARE BUFFER: STANDBY</span>
            </div>
          </div>

          {/* Module 03: Relocation Priority Triage */}
          <div className="p-5 bg-isie-panel border border-white/10 rounded-sm flex flex-col justify-between min-h-[380px] min-w-0">
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                <div>
                  <div className="font-mono text-xs font-semibold uppercase tracking-wider text-white">
                    Module 03 // Relocation Priority Scoring
                  </div>
                  <div className="text-[11px] text-isie-text-dim">
                    Objective relocation ranking derived from hazard severity & isolation risk
                  </div>
                </div>
                <TacticalBadge variant="orange" size="sm">
                  RELOCATION
                </TacticalBadge>
              </div>

              <EmptyState
                compact
                icon="database"
                title="Relocation Index Pipeline Inactive"
                description="No habitations are currently designated for emergency evacuation. When a hazard red-zone triggers, priority scores (0-100) will rank vulnerable sectors."
                statusText="STANDBY // 0 QUEUED"
              />
            </div>

            <div className="pt-3 border-t border-white/10 font-mono text-[10px] text-isie-text-dim flex justify-between">
              <span>DESIGNATED SHELTERS: READY</span>
              <span>EVACUATION ROUTES: OPEN</span>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
