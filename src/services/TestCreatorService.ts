import type { OptionToCreate } from '@/interfaces/option.ts'
import { type QuestionToCreate } from '@/interfaces/question.ts'
import type { Scale, ScaleSection } from '@/interfaces/test-evaluation.ts'

export default class TestCreatorService {

  private static instance: TestCreatorService;

  private constructor() {}

  public static getInstance(): TestCreatorService {
    if (!TestCreatorService.instance) {
      TestCreatorService.instance = new TestCreatorService();
    }
    return TestCreatorService.instance;
  }

  public newScale(index: number): Scale {
    return {
      index,
      nameRus: '',
      nameKaz: '',
      sections: new Array<ScaleSection>(this.newScaleSection(1)),
    }
  }

  public newScaleSection(index: number): ScaleSection {
    return {
      index,
      lowerBound: 0,
      upperBound: 0,
      descriptionKaz: '',
      descriptionRus: '',
    }
  }

  public newQuestionToCreate(optionsPerQuestion: number): QuestionToCreate {
    return {
      withFile: false,
      file: null,
      nameRus: '',
      nameKaz: '',
      options: this.newOptionToCreateList(optionsPerQuestion),
    }
  }

  public newOptionToCreateList(optionsPerQuestion: number): OptionToCreate[] {
    return Array.from(
      { length: optionsPerQuestion },
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
