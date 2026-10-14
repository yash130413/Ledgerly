export type {
  AuditProvider,
  AuditPriority,
  AuditRecommendation,
  AuditUseCase,
  ActivitySource,
  WorkspaceMetrics,
  AuditEngineResult,
  AuditFormToolInput,
  AuditFormContext,
  UserSegmentTier,
  UserSegmentation,
  EffortLevel,
  EffortImpact,
  BenchmarkStatus,
  IndustryBenchmark,
} from "./types";

export { runAuditEngine, computeIndustryBenchmark } from "./engine";
export { mapProviderId, mapWorkspacesToEngine } from "./mappers";
export {
  buildAuditWorkspaces,
  estimateActiveSeats,
  segmentUsers,
  pricePerSeat,
  PLAN_PRICE_PER_SEAT,
  isAnnualCommitmentPlan,
} from "./enrich";
