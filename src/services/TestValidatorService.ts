import type { OptionToCreate } from '@/interfaces/option.ts'
import { type QuestionToCreate } from '@/interfaces/question.ts'
import { type TestToCreate, TestType } from '@/interfaces/test.ts'
import type { VariantToCreate } from '@/interfaces/variant.ts'
import type { Scale } from '@/interfaces/test-evaluation.ts'

export default class TestValidatorService {
  private static instance: TestValidatorService

  private emptyFields: string[]
  private errors: string[]
  private test: TestToCreate | null
  private scaleIndex: number
  private variantIndex: number
  private questionIndex: number
  private optionIndex: number

  private constructor() {
    this.emptyFields = []
    this.errors = []
    this.test = null
    this.scaleIndex = 0
    this.variantIndex = 0
    this.questionIndex = 0
    this.optionIndex = 0
  }

  public static getInstance(): TestValidatorService {
    if (!TestValidatorService.instance) {
      TestValidatorService.instance = new TestValidatorService()
    }
    return TestValidatorService.instance
  }

  public validate(test: TestToCreate): void {
    this.emptyFields = []
    this.errors = []

    this.test = test
    this.validateTest()

    if (this.emptyFields.length > 0) {
      throw `следующие поля не заполнены: ${this.emptyFields.join(', ')}`
    }
    if (this.errors.length > 0) {
      throw `возникли следующие ошибки: ${this.errors.join(', ')}`
    }
  }

  private validateTest(): void {
    if (this.test === null) throw 'Test is required for validation'
    this.validateTestFields()

    this.test.scales.forEach((_, scaleIndex: number): void => {
      this.scaleIndex = scaleIndex
      this.validateScale()
    })

    this.test.variants.forEach((_, variantIndex: number): void => {
      this.variantIndex = variantIndex
      this.validateVariant()
    })
  }

  private validateTestFields(): void {
    if (this.test === null) throw 'Test is required for validation'

    if (!this.test.nameRus) this.emptyFields.push('название теста (рус)')
    if (!this.test.nameKaz) this.emptyFields.push('название теста (каз)')
    if (!this.test.isLimitless && !this.test.duration) this.emptyFields.push('длительность')
    if (this.test.areasOfActivities.length === 0) {
      this.emptyFields.push('направления деятельности')
    }
  }

  private validateScale(): void {
    if (this.test === null) throw 'Test is required for validation'

    const scale: Scale = this.test.scales[this.scaleIndex];
    if (!scale.nameKaz) this.emptyFields.push(`название (каз) в шкале ${scale.index}`)
    if (!scale.nameRus) this.emptyFields.push(`название (рус) в шкале ${scale.index}`)
  }

  private validateVariant(): void {
    if (this.test === null) throw 'Test is required for validation'
    this.getVariantByIndex().questions.forEach((_, questionIndex: number): void => {
      this.questionIndex = questionIndex
      this.validateQuestion()
    })
  }

  private getVariantByIndex(): VariantToCreate {
    if (this.test === null) throw 'Test is required for validation'
    return this.test.variants[this.variantIndex]
  }

  private validateQuestion(): void {
    if (this.test === null) throw 'Test is required for validation'
    this.validateQuestionFields()

    // нет нужды валидировать варианты ответа тестов с этими типами
    // т.к. пользователь не указывает их
    const typesRequiringNoValidation: TestType[] = [
      TestType.pointDistribution,
      TestType.withOpenQuestions
    ]
    if (typesRequiringNoValidation.includes(this.test.type)) return
    this.validateQuestionByType()

    const question: QuestionToCreate = this.getQuestionByIndex()
    question.options.forEach((_, optionIndex: number): void => {
      this.optionIndex = optionIndex
      this.validateOption()
    })
  }

  private validateQuestionFields(): void {
    const question: QuestionToCreate = this.getQuestionByIndex()

    if (question.withFile && question.file === null) {
      this.emptyFields.push(
        `файл в вопросе ${this.questionIndex + 1} в варианте ${this.variantIndex + 1}`,
      )
    }
    if (!question.nameRus) this.emptyFields.push(`вопрос (рус) в вопросе ${this.questionIndex + 1}`)
    if (!question.nameKaz) this.emptyFields.push(`вопрос (каз) в вопросе ${this.questionIndex + 1}`)
  }

  private validateQuestionByType(): void {
    if (this.test === null) throw 'Test is required for validation'

    this.validateOptionCount()

    if (this.test.type === TestType.withMcqHavingNoCorrect) return

    this.validateCorrectOptionCount()
  }

  private validateOptionCount(): void {
    const question: QuestionToCreate = this.getQuestionByIndex()
    if (question.options.length > 1) return
    this.errors.push(
      `не достаточное количество вариантов ответа в вопросе ${this.questionIndex + 1} в варианте ${this.variantIndex + 1}`,
    )
  }

  private validateCorrectOptionCount(): void {
    const correctOptionCount: number = this.countCorrectOptions()
    const validCorrectOptionCount: boolean = this.isCorrectOptionCountValid(correctOptionCount)

    if (validCorrectOptionCount) return
    this.errors.push(
      `в вопросе ${this.questionIndex + 1} в варианте ${this.variantIndex + 1} должен быть один правильный вариант ответа`,
    )
  }

  private countCorrectOptions(): number {
    if (this.test === null) throw 'Test is required for validation'
    const question: QuestionToCreate = this.getQuestionByIndex()
    return question.options.filter((option: OptionToCreate): boolean => option.isCorrect ?? false)
      .length
  }

  private getQuestionByIndex(): QuestionToCreate {
    return this.getVariantByIndex().questions[this.questionIndex]
  }

  private isCorrectOptionCountValid(correctOptionCount: number): boolean {
    if (this.test === null) throw 'Test is required for validation'

    if (this.test.type === TestType.withMcqHavingOneCorrect.valueOf()) {
      return correctOptionCount === 1
    }
    if (this.test.type === TestType.withMcqHavingMultipleCorrect.valueOf()) {
      return correctOptionCount > 1
    }

    return false
  }

  private validateOption(): void {
    const option: OptionToCreate = this.getOptionByIndex()
    const emptyFieldLocation: string = `в варианте ответа ${this.optionIndex + 1} в вопросе ${this.questionIndex + 1} в варианте ${this.variantIndex + 1}`
    if (option.withFile && option.file === null) this.emptyFields.push(`файл ${emptyFieldLocation}`)
    if (!option.nameKaz) this.emptyFields.push(`ответ (каз) ${emptyFieldLocation}`)
    if (!option.nameRus) this.emptyFields.push(`ответ (рус) ${emptyFieldLocation}`)
  }

  private getOptionByIndex(): OptionToCreate {
    return this.getQuestionByIndex().options[this.optionIndex]
  }

}
