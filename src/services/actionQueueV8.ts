import {
  LandAcquisitionProject,
  ActionQueueItem,
  QueueExplanation,
  AttentionBudget,
  DecisionLogEntry,
  EvidenceHealthState,
} from '../types';
import { buildActionQueue } from './dataPipeline';

export function buildActionQueueV8(
  projects: LandAcquisitionProject[],
  decisionLogs: DecisionLogEntry[],
  budgetLimit: number = 10
): { queue: ActionQueueItem[]; explanations: QueueExplanation[]; budget: AttentionBudget } {
  const fullQueue = buildActionQueue(projects, decisionLogs);

  const evidenceWeightedQueue = fullQueue.map(item => {
    let adjustedScore = item.ipiScore;
    if (item.riskLevel === 'RED') adjustedScore *= 0.85;
    if (item.riskLevel === 'AMBER') adjustedScore *= 0.95;
    if (item.riskLevel === 'GREEN') adjustedScore *= 1.05;
    return { ...item, adjustedIpiScore: Math.round(adjustedScore) };
  }).sort((a, b) => b.adjustedIpiScore - a.adjustedIpiScore);

  let excludedByConfidence = 0;
  let excludedByAbstention = 0;
  let includedAbstained = 0;

  const selectedQueue = evidenceWeightedQueue.slice(0, budgetLimit);
  const excludedItems = evidenceWeightedQueue.slice(budgetLimit);

  excludedItems.forEach(item => {
    if (item.riskLevel === 'RED') {
      includedAbstained++;
    } else {
      excludedByConfidence++;
    }
  });

  const budget: AttentionBudget = {
    totalCases: fullQueue.length,
    selectedCases: selectedQueue.length,
    budgetLimit,
    selectionMethod: 'IPI_TOP_N',
    excludedByConfidence,
    excludedByAbstention,
    includedAbstained,
  };

  const explanations: QueueExplanation[] = selectedQueue.map((item, idx) => {
    const project = projects.find(p => p.id === item.projectId);
    const daysLeft = project ? project.statutoryClockMaxDays - project.currentStageElapsedDays : 999;

    let primaryReason = '';
    let secondaryReason = '';

    if (daysLeft <= 30) {
      primaryReason = `Statutory clock expires in ${daysLeft} days`;
    } else if (item.riskLevel === 'RED') {
      primaryReason = 'Evidence health is RED - prediction reliability low';
    } else if (item.priority === 'CRITICAL') {
      primaryReason = 'Project classified as CRITICAL priority';
    } else {
      primaryReason = item.topDriver;
    }

    const criticalDeps = project?.dependencies.filter(d => d.status === 'CRITICAL') || [];
    if (criticalDeps.length > 0) {
      secondaryReason = `${criticalDeps.length} unresolved critical dependencies (${criticalDeps.map(d => d.type.replace('_', ' ')).join(', ')})`;
    } else {
      secondaryReason = `Next milestone: ${item.nextMilestone} (${item.daysToMilestone}d horizon)`;
    }

    const downstreamImpact: QueueExplanation['downstreamImpact'] =
      criticalDeps.length >= 2 ? 'HIGH' : criticalDeps.length === 1 ? 'MEDIUM' : 'LOW';

    return {
      projectId: item.projectId,
      rank: idx + 1,
      ipiScore: item.ipiScore,
      contributions: {
        urgency: item.urgencyScore,
        criticality: item.criticalityScore,
        actionability: item.actionabilityScore,
        riskMovement: item.ipiScore - item.urgencyScore - item.criticalityScore - item.actionabilityScore,
      },
      primaryReason,
      secondaryReason,
      downstreamImpact,
      evidenceQuality: item.riskLevel,
      confidenceNote: item.riskLevel === 'RED'
        ? 'Low confidence - evidence degraded'
        : item.riskLevel === 'AMBER'
        ? 'Moderate confidence - partial evidence support'
        : undefined,
    };
  });

  return { queue: selectedQueue, explanations, budget };
}

export function getAttentionBudgetSummary(budget: AttentionBudget): string {
  return `${budget.selectedCases} of ${budget.totalCases} cases selected. ` +
    `${budget.excludedByConfidence} excluded by confidence, ${budget.excludedByAbstention} excluded by abstention.`;
}

export function explainRanking(
  explanation: QueueExplanation,
  language: 'EN' | 'HI'
): string {
  if (language === 'HI') {
    return `Rank ${explanation.rank}: IPI ${explanation.ipiScore}. ` +
      `प्राथमिक कारण: ${explanation.primaryReason}. ` +
      `द्वितीयक कारण: ${explanation.secondaryReason}. ` +
      `डाउनस्ट्रीम प्रभाव: ${explanation.downstreamImpact}.`;
  }
  return `Rank ${explanation.rank}: IPI ${explanation.ipiScore}. ` +
    `Primary: ${explanation.primaryReason}. ` +
    `Secondary: ${explanation.secondaryReason}. ` +
    `Downstream: ${explanation.downstreamImpact}.`;
}
