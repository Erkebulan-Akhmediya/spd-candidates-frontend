import type { OptionToCreate, OptionToSend } from '@/interfaces/option.ts'
import type { QuestionToCreate, QuestionToSend } from '@/interfaces/question.ts'
import type { VariantToCreate, VariantToSend } from '@/interfaces/variant.ts'
import { type TestToCreate, type TestToSend, TestType } from '@/interfaces/test.ts'
import type FileService from '@/services/FileService.ts'

export default class TestConverterService {
  private static instance: TestConverterService
  private testType: TestType
  private maxPointsPerQuestion: number

  private constructor(private readonly file: FileService) {
    // дефолтные значения, выбраны случайно
    this.testType = 1
    this.maxPointsPerQuestion = 1
  }

  public static getInstance(file: FileService): TestConverterService {
    if (!TestConverterService.instance) {
      TestConverterService.instance = new TestConverterService(file)
    }
    return TestConverterService.instance
  }

  public async convertTestToSend(test: TestToCreate): Promise<TestToSend> {
    this.testType = test.type
    this.maxPointsPerQuestion = test.maxPointsPerQuestion
    return {
      ...test,
      variants: await Promise.all(test.variants.map(this.convertVariantToSend.bind(this))),
    }
  }

  private async convertVariantToSend(variant: VariantToCreate): Promise<VariantToSend> {
    return {
      ...variant,
      questions: await Promise.all(variant.questions.map(this.convertQuestionToSend.bind(this))),
    }
  }

  private async convertQuestionToSend(question: QuestionToCreate): Promise<QuestionToSend> {
    let options: OptionToSend[]
    if (this.testType === TestType.pointDistribution) {
      options = this.createOptionsForPointDistribution()
    } else {
      options = await Promise.all(question.options.map(this.convertOptionToSend.bind(this)))
    }

    return {
      ...question,
      fileName: question.withFile ? await this.file.upload(question.file!) : null,
      options: options,
    }
  }

  private createOptionsForPointDistribution(): OptionToSend[] {
    let name: string = 'a'
    const optionsToSend: OptionToSend[] = []
    for (let i: number = 0; i < this.maxPointsPerQuestion; i++) {
      optionsToSend.push({
        withFile: false,
        fileName: null,
        nameRus: name,
        nameKaz: name,
        isCorrect: null,
      })
      name = this.getNextChar(name)
    }
    return optionsToSend
  }

  private getNextChar(char: string): string {
    if (char.length !== 1) throw 'character is required'

    char = char.toLowerCase()
    if (char === 'z') throw 'Достигнуто максимальное количество варинатов ответа'

    const code: number = char.charCodeAt(0)

    return String.fromCharCode(code + 1).toLowerCase()
  }

  private async convertOptionToSend(option: OptionToCreate): Promise<OptionToSend> {
    return {
      ...option,
      fileName: option.withFile ? await this.file.upload(option.file!) : null,
    }
  }
}
