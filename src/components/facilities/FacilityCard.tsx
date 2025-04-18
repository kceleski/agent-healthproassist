
import React from "react";
import type { Facility } from "@/types/facility";
import { BasicFacilityCard } from "./cards/BasicFacilityCard";
import { ListViewFacilityCard } from "./cards/ListViewFacilityCard";
import { GridViewFacilityCard } from "./cards/GridViewFacilityCard";

interface FacilityCardProps {
  facility: Facility;
  index: number;
  isPro?: boolean;
  viewMode?: "grid" | "list";
}

export function FacilityCard({ facility, index, isPro = false, viewMode = "grid" }: FacilityCardProps) {
  if (!isPro) {
    return <BasicFacilityCard facility={facility} index={index} />;
  }

  if (viewMode === "list") {
    return <ListViewFacilityCard facility={facility} index={index} />;
  }

  return <GridViewFacilityCard facility={facility} index={index} />;
}
