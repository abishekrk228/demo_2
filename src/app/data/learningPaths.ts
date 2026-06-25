export type LearningModule = {
  slug: string;
  title: string;
  description: string;
  stage: string;
  duration: string;
  estimatedMinutes: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
};

export type LearningPath = {
  id: number;
  slug: string;
  title: string;
  desc: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  students: number;
  recommended: boolean;
  modules: LearningModule[];
};

export type LearningProgress = Record<string, string[]>;
export type LastVisitedModule = { pathSlug: string; moduleSlug: string };

const STORAGE_KEY = 'tapeitout.learningProgress';
const STORAGE_COMPLETED = 'tapeitout.completedModules';
const STORAGE_ACTIVE_PATH = 'tapeitout.activeLearningPath';
const STORAGE_LAST_MODULE = 'tapeitout.lastVisitedModule';
const STORAGE_LEARNING_TIME = 'tapeitout.learningTimeMinutes';

export const learningPaths: LearningPath[] = [
  {
    id: 1,
    slug: 'openroad-complete-flow',
    title: 'OpenROAD Complete Flow',
    desc: 'Master the full RTL-to-GDSII flow using the OpenROAD open-source EDA toolchain.',
    level: 'Intermediate',
    students: 1847,
    recommended: true,
    modules: [
      {
        slug: 'rtl-design-fundamentals',
        title: 'RTL Design Fundamentals',
        description: 'Understand RTL structure, synthesis readiness, and design hierarchy for successful physical implementation.',
        stage: 'RTL Design',
        duration: '35 min',
        estimatedMinutes: 35,
        difficulty: 'Beginner',
      },
      {
        slug: 'synthesis-with-yosys',
        title: 'Synthesis with Yosys',
        description: 'Learn how to use Yosys to synthesize RTL into gate-level netlists that are ready for placement and timing analysis.',
        stage: 'Synthesis',
        duration: '42 min',
        estimatedMinutes: 42,
        difficulty: 'Intermediate',
      },
      {
        slug: 'floorplanning-basics',
        title: 'Floorplanning Basics',
        description: 'Create die boundaries, macro placements, and region constraints that make placement and routing predictable.',
        stage: 'Floorplanning',
        duration: '38 min',
        estimatedMinutes: 38,
        difficulty: 'Intermediate',
      },
      {
        slug: 'placement-and-cts',
        title: 'Placement and CTS',
        description: 'Coordinate placement with clock tree synthesis to preserve timing and avoid congestion during routing.',
        stage: 'Placement',
        duration: '46 min',
        estimatedMinutes: 46,
        difficulty: 'Advanced',
      },
      {
        slug: 'routing-and-signoff',
        title: 'Routing and Signoff',
        description: 'Complete the physical design flow by routing nets, checking DRC/LVS, and validating timing closure with signoff tools.',
        stage: 'Signoff',
        duration: '50 min',
        estimatedMinutes: 50,
        difficulty: 'Advanced',
      },
    ],
  },
  {
    id: 2,
    slug: 'timing-closure-mastery',
    title: 'Timing Closure Mastery',
    desc: 'Systematic approach to identifying and fixing setup, hold, and clock timing violations.',
    level: 'Advanced',
    students: 923,
    recommended: false,
    modules: [
      {
        slug: 'timing-analysis-fundamentals',
        title: 'Timing Analysis Fundamentals',
        description: 'Build a solid foundation in static timing analysis, slack, and timing exceptions for a reliable closure strategy.',
        stage: 'Timing Analysis',
        duration: '32 min',
        estimatedMinutes: 32,
        difficulty: 'Intermediate',
      },
      {
        slug: 'reading-sta-reports',
        title: 'Reading STA Reports',
        description: 'Interpret static timing analysis reports to identify the worst paths, clean nets, and timing endpoints that matter most.',
        stage: 'Timing Analysis',
        duration: '38 min',
        estimatedMinutes: 38,
        difficulty: 'Intermediate',
      },
      {
        slug: 'setup-violation-debugging',
        title: 'Setup Violation Debugging',
        description: 'Examine setup failures and apply targeted fixes across constraints, placement, and clock definitions.',
        stage: 'Timing Analysis',
        duration: '44 min',
        estimatedMinutes: 44,
        difficulty: 'Advanced',
      },
      {
        slug: 'hold-violation-repair',
        title: 'Hold Violation Repair',
        description: 'Learn the difference between clock skew and data path timing, and apply repair strategies without creating setup issues.',
        stage: 'Timing Analysis',
        duration: '40 min',
        estimatedMinutes: 40,
        difficulty: 'Advanced',
      },
      {
        slug: 'advanced-timing-optimization',
        title: 'Advanced Timing Optimization',
        description: 'Apply ECOs, buffering, clock tree tuning, and constraint refinement to push a design across timing closure.',
        stage: 'Timing Analysis',
        duration: '46 min',
        estimatedMinutes: 46,
        difficulty: 'Advanced',
      },
    ],
  },
  {
    id: 3,
    slug: 'sky130-design-fundamentals',
    title: 'Sky130 Design Fundamentals',
    desc: 'Complete guide to designing for the SkyWater 130nm process using open-source tools.',
    level: 'Beginner',
    students: 3421,
    recommended: false,
    modules: [
      {
        slug: 'sky130-pdk-overview',
        title: 'Sky130 PDK Overview',
        description: 'Understand the structure, libraries, and manufacturing context of the Sky130 open PDK.',
        stage: 'Sky130 PDK',
        duration: '28 min',
        estimatedMinutes: 28,
        difficulty: 'Beginner',
      },
      {
        slug: 'standard-cell-libraries',
        title: 'Standard Cell Libraries',
        description: 'Choose the correct standard-cell library flavors, drive strengths, and models for your design and timing targets.',
        stage: 'Sky130 PDK',
        duration: '34 min',
        estimatedMinutes: 34,
        difficulty: 'Beginner',
      },
      {
        slug: 'design-rules-and-constraints',
        title: 'Design Rules and Constraints',
        description: 'Learn how PDK design rules and SDC constraints work together to ensure manufacturability and functional timing.',
        stage: 'Floorplanning',
        duration: '42 min',
        estimatedMinutes: 42,
        difficulty: 'Intermediate',
      },
      {
        slug: 'physical-design-flow',
        title: 'Physical Design Flow',
        description: 'Follow the Sky130 physical design flow from RTL through placement, routing, and signoff with open-source tools.',
        stage: 'Placement',
        duration: '36 min',
        estimatedMinutes: 36,
        difficulty: 'Intermediate',
      },
      {
        slug: 'tapeout-preparation',
        title: 'Tapeout Preparation',
        description: 'Prepare final GDSII data, verify DRC/LVS, and understand the handoff requirements for Sky130 tapeout.',
        stage: 'Signoff',
        duration: '44 min',
        estimatedMinutes: 44,
        difficulty: 'Intermediate',
      },
    ],
  },
  {
    id: 4,
    slug: 'physical-design-troubleshooting',
    title: 'Physical Design Troubleshooting',
    desc: 'Learn to diagnose and fix the most common RTL-to-GDSII implementation failures.',
    level: 'Intermediate',
    students: 2104,
    recommended: true,
    modules: [
      {
        slug: 'drc-error-analysis',
        title: 'DRC Error Analysis',
        description: 'Understand how design rule violations occur and how to interpret DRC reports to drive targeted fixes.',
        stage: 'DRC & LVS',
        duration: '35 min',
        estimatedMinutes: 35,
        difficulty: 'Intermediate',
      },
      {
        slug: 'lvs-debugging',
        title: 'LVS Debugging',
        description: 'Trace netlist mismatches, extraction issues, and layout connectivity problems using LVS diagnostics.',
        stage: 'DRC & LVS',
        duration: '38 min',
        estimatedMinutes: 38,
        difficulty: 'Intermediate',
      },
      {
        slug: 'congestion-analysis',
        title: 'Congestion Analysis',
        description: 'Analyze routing congestion and pin density to resolve unrouted nets and improve detailed routing success.',
        stage: 'Routing',
        duration: '34 min',
        estimatedMinutes: 34,
        difficulty: 'Intermediate',
      },
      {
        slug: 'cts-debugging',
        title: 'CTS Debugging',
        description: 'Investigate CTS failures, skew issues, and clock net problems to correct synthesized tree implementations.',
        stage: 'CTS',
        duration: '40 min',
        estimatedMinutes: 40,
        difficulty: 'Advanced',
      },
      {
        slug: 'routing-failure-resolution',
        title: 'Routing Failure Resolution',
        description: 'Recover from routing failures by improving placement, adjusting layer usage, and reducing congestion hotspots.',
        stage: 'Routing',
        duration: '42 min',
        estimatedMinutes: 42,
        difficulty: 'Advanced',
      },
    ],
  },
];

export function loadLearningProgress(): LearningProgress {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as LearningProgress) : {};
  } catch {
    return {};
  }
}

export function saveLearningProgress(progress: LearningProgress) {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  saveCompletedModules(getAllCompletedModules(progress));
}

export function loadCompletedModules(): string[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = localStorage.getItem(STORAGE_COMPLETED);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function saveCompletedModules(completed: string[]) {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(STORAGE_COMPLETED, JSON.stringify(Array.from(new Set(completed))));
}

export function loadActiveLearningPath(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return localStorage.getItem(STORAGE_ACTIVE_PATH);
}

export function saveActiveLearningPath(pathSlug: string) {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(STORAGE_ACTIVE_PATH, pathSlug);
}

export function loadLastVisitedModule(): LastVisitedModule | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = localStorage.getItem(STORAGE_LAST_MODULE);
    return raw ? (JSON.parse(raw) as LastVisitedModule) : null;
  } catch {
    return null;
  }
}

export function saveLastVisitedModule(lastVisited: LastVisitedModule) {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(STORAGE_LAST_MODULE, JSON.stringify(lastVisited));
}

export function loadLearningTimeMinutes(): number {
  if (typeof window === 'undefined') {
    return 0;
  }

  const raw = localStorage.getItem(STORAGE_LEARNING_TIME);
  return raw ? Number(raw) : 0;
}

export function saveLearningTimeMinutes(minutes: number) {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(STORAGE_LEARNING_TIME, String(minutes));
}

export function incrementLearningTime(minutes: number) {
  const current = loadLearningTimeMinutes();
  saveLearningTimeMinutes(current + minutes);
}

export function getAllCompletedModules(progress: LearningProgress) {
  return [...new Set(Object.values(progress).flat())];
}

export function getPathProgress(path: LearningPath, progress: LearningProgress) {
  const completed = progress[path.slug]?.length ?? 0;
  return Math.round((completed / path.modules.length) * 100);
}

export function getPathCompletedCount(path: LearningPath, progress: LearningProgress) {
  return progress[path.slug]?.length ?? 0;
}

export function getTimeRemaining(path: LearningPath, progress: LearningProgress) {
  const completed = progress[path.slug] ?? [];
  return path.modules
    .filter((module) => !completed.includes(module.slug))
    .reduce((sum, module) => sum + module.estimatedMinutes, 0);
}

export function getNextUnfinishedModule(path: LearningPath, progress: LearningProgress) {
  const completed = progress[path.slug] ?? [];
  return path.modules.find((module) => !completed.includes(module.slug)) ?? null;
}

export function getContinueModuleForPaths(paths: LearningPath[], progress: LearningProgress, lastVisited: LastVisitedModule | null) {
  if (lastVisited) {
    const lastPath = getPathBySlug(lastVisited.pathSlug);
    const lastModule = lastPath ? getModuleBySlug(lastVisited.pathSlug, lastVisited.moduleSlug) : null;
    if (lastPath && lastModule && !(progress[lastVisited.pathSlug] ?? []).includes(lastVisited.moduleSlug)) {
      return { path: lastPath, module: lastModule };
    }
  }

  for (const path of paths) {
    const next = getNextUnfinishedModule(path, progress);
    if (next) {
      return { path, module: next };
    }
  }

  return null;
}

export function getPathBySlug(slug: string) {
  return learningPaths.find((path) => path.slug === slug) ?? null;
}

export function getModuleBySlug(pathSlug: string, moduleSlug: string) {
  const path = getPathBySlug(pathSlug);
  if (!path) {
    return null;
  }
  return path.modules.find((module) => module.slug === moduleSlug) ?? null;
}

export function getRecommendedModules(paths: LearningPath[], progress: LearningProgress, lastVisited: LastVisitedModule | null) {
  const recommendations: Array<{ path: LearningPath; module: LearningModule; reason: string }> = [];

  const continueEntry = getContinueModuleForPaths(paths, progress, lastVisited);
  if (continueEntry) {
    recommendations.push({ ...continueEntry, reason: 'Resume current learning path' });
  }

  const partialPaths = paths
    .filter((path) => {
      const completed = getPathCompletedCount(path, progress);
      return completed > 0 && completed < path.modules.length;
    })
    .sort((a, b) => getPathProgress(b, progress) - getPathProgress(a, progress));

  partialPaths.forEach((path) => {
    const next = getNextUnfinishedModule(path, progress);
    if (next && recommendations.length < 3 && !recommendations.some((item) => item.module.slug === next.slug)) {
      recommendations.push({ path, module: next, reason: `Continue ${path.title}` });
    }
  });

  if (recommendations.length < 3) {
    paths.forEach((path) => {
      if (recommendations.length >= 3) return;
      const next = getNextUnfinishedModule(path, progress);
      if (next && !recommendations.some((item) => item.module.slug === next.slug)) {
        recommendations.push({ path, module: next, reason: `Recommended from ${path.title}` });
      }
    });
  }

  return recommendations.slice(0, 3);
}

export function getModuleStatus(path: LearningPath, module: LearningModule, progress: LearningProgress) {
  const completed = progress[path.slug] ?? [];
  if (completed.includes(module.slug)) {
    return 'completed';
  }

  const next = getNextUnfinishedModule(path, progress);
  return next?.slug === module.slug ? 'current' : 'locked';
}
