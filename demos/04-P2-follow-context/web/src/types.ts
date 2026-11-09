export type RequestStatus = 'New' | 'Reviewed';
export interface RequestSummary { id: string; municipality: string; projectTitle: string; status: RequestStatus }
export interface Readiness { isReady: boolean; missingFields: string[] }
export interface Activity { action: string; actor: string; occurredAt: string; correlationId: string }
export interface RequestDetail extends RequestSummary {
  description: string; budgetAttached: boolean; readiness: Readiness | null; activity: Activity[];
}
export type RequestUpdate = Pick<RequestDetail, 'municipality' | 'projectTitle' | 'description' | 'budgetAttached'>;
