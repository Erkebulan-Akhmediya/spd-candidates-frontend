export interface TestSessionListForAssessment {
  count: number
  testSessions: TestSessionForAssessment[]
}

export interface TestSessionForAssessment {
  id: number
  candidateFullName: string
  testNameRus: string
  testNameKaz: string
  statusId: number
  statusNameRus: string
  statusNameKaz: string
  answers: TestSessionAnswerForAssessment[]
}

export interface TestSessionAnswerForAssessment {
  id: number
  questionNameRus: string
  questionNameKaz: string
  answer: string
  assessment: string
}
