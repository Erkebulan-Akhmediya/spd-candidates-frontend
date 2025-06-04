import type { EditableOption } from '@/interfaces/option.ts'
import { type EditableQuestion } from '@/interfaces/question.ts'
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
      conditions: []
    }
  }

  public newQuestion(optionsPerQuestion: number): EditableQuestion {
    return {
      withFile: false,
      file: null,
      nameRus: '',
      nameKaz: '',
      options: this.newOptionList(optionsPerQuestion),
      isDisappearing: false,
      timeToDisappear: 1
    }
  }

  public newOptionList(optionsPerQuestion: number): EditableOption[] {
    return Array.from(
      { length: optionsPerQuestion },
      (): EditableOption => this.newOption(),
    )
  }

  public newOption(): EditableOption {
    return {
      withFile: false,
      file: null,
      nameKaz: '',
      nameRus: '',
      isCorrect: null,
      increment: {
        index: 1,
        scaleIndex: 1,
        score: 0
      }
    }
  }

}
