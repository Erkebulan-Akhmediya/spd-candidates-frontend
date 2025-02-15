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
