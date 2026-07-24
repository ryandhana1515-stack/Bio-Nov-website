"use client";

import { createContext, useContext } from "react";

export type ExperienceContextValue = {
  /** false when prefers-reduced-motion — no pinned scenes, no scrub */
  motionOk: boolean;
};

export const ExperienceContext = createContext<ExperienceContextValue>({ motionOk: true });

export function useExperience(): ExperienceContextValue {
  return useContext(ExperienceContext);
}
