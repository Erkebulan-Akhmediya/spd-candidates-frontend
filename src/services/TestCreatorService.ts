import type { OptionToCreate } from '@/interfaces/option.ts'
import { type QuestionToCreate } from '@/interfaces/question.ts'

export default class TestCreatorService {

  constructor(private readonly optionsPerQuestion: number) {}

  public newQuestionToCreate(): QuestionToCreate {
    return {
      withFile: false,
      file: null,
      nameRus: '',
      nameKaz: '',
      options: this.newOptionToCreateList(),
    }
  }

  public newOptionToCreateList(): OptionToCreate[] {
    return Array.from(
      { length: this.optionsPerQuestion },
      (): OptionToCreate => this.newOptionToCreate(),
    )
  }

  public newOptionToCreate(): OptionToCreate {
    return {
      withFile: false,
      file: null,
      nameKaz: '',
      nameRus: '',
      isCorrect: null,
    }
  }

}
