import type {ConfidenceLevel,LearningAttempt} from '../types';

export const confidenceLabels:Record<ConfidenceLevel,string>={low:'Not sure',medium:'Fairly sure',high:'Very sure'};

export function scheduleAttempt(attempt:Omit<LearningAttempt,'id'|'answeredAt'|'nextReviewAt'|'reviewCount'|'note'|'resolved'>):LearningAttempt{
  const answeredAt=new Date();
  const delay=attempt.isCorrect?attempt.confidence==='high'?7:attempt.confidence==='medium'?3:1:0;
  return {...attempt,id:`${attempt.caseId}-${attempt.questionId}-${answeredAt.getTime()}`,answeredAt:answeredAt.toISOString(),nextReviewAt:new Date(answeredAt.getTime()+delay*86400000).toISOString(),reviewCount:0,note:'',resolved:false};
}

export function rescheduleAttempt(attempt:LearningAttempt,rating:'again'|'hard'|'good'):LearningAttempt{
  const days=rating==='again'?1:rating==='hard'?3:Math.min(30,7*Math.max(1,attempt.reviewCount+1));
  return {...attempt,nextReviewAt:new Date(Date.now()+days*86400000).toISOString(),reviewCount:attempt.reviewCount+1,resolved:rating==='good'};
}
