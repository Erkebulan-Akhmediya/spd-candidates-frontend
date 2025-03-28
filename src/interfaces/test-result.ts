export interface CheckedTestSessionList {
  count: number
  testSessions: CheckedTestSession[]
}

export interface CheckedTestSession {
  id: number
  candidateFullName: string
  testNameRus: string
  testNameKaz: string
}

export interface TestSessionResultList {
  resultType: string
  results: TestSessionResult[]
}

export interface TestSessionResult {
  questionNameRus: string | null
  questionNameKaz: string | null
  answer: string | null
  assessment: string | null
  score: number
  scaleNameRus: string | null
  scaleNameKaz: string | null
  descriptionRus: string | null
  descriptionKaz: string | null
  fileUrl?: string
}
