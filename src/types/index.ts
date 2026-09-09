export type BTKVDomain='Cardiac'|'Congenital cardiac'|'Thoracic'|'Vascular'|'Emergency'|'Perioperative'|'Postoperative critical care';
export interface VitalSign {label:string;value:string;status?:'normal'|'warning'|'critical'}
export interface LabResult {name:string;value:string;reference:string;unit:string;status:'normal'|'high'|'low'|'critical'}
export interface Investigation {type:string;summary:string;details:string[]}
export interface RiskAssessment {name:string;value:string;interpretation:string}
export interface ClinicalQuestion {id:string;stage:string;prompt:string;options:string[];correct:number;explanation:string;hint:string}
export interface OperativeStrategy {approach:string;procedure:string;keySteps:string[]}
export interface Reference {title:string;source:string}
export interface BTKVCase {id:string;slug:string;title:string;subtitle:string;domain:BTKVDomain;diagnosisCategory:string;patientGroup:'adult'|'pediatric';urgency:'elective'|'urgent'|'emergency';phase:'preoperative'|'intraoperative'|'postoperative';difficulty:'beginner'|'intermediate'|'advanced';estimatedMinutes:number;updatedAt:string;thumbnail:string;keywords:string[];learningObjectives:string[];chiefComplaint:string;presentation:string;history:string[];riskFactors:string[];medications:string[];vitalSigns:VitalSign[];physicalExamination:string[];laboratoryResults:LabResult[];investigations:Investigation[];differentialDiagnoses:string[];riskAssessment:RiskAssessment[];questions:ClinicalQuestion[];finalDiagnosis:string;surgicalIndication:string;operativeStrategy:OperativeStrategy;perioperativeConsiderations:string[];postoperativeMonitoring:string[];complications:string[];prognosis:string;clinicalPearls:string[];references:Reference[]}
export interface CaseProgress {status:'not-started'|'in-progress'|'completed';score:number;updatedAt:string}
