import type { OptionToCreate } from '@/interfaces/option.ts'
import { type QuestionToCreate } from '@/interfaces/question.ts'
import { type TestToCreate, TestType } from '@/interfaces/test.ts'
import type { VariantToCreate } from '@/interfaces/variant.ts'

export default class TestValidatorService {
  private emptyFields: string[]
  private errors: string[]
  private test: TestToCreate;
  private variantIndex: number;
  private questionIndex: number;
  private optionIndex: number;

  constructor() {
    this.emptyFields = []
    this.errors = []
    this.variantIndex = 0
    this.questionIndex = 0
    this.optionIndex = 0
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
    if (this.test === null) throw 'Test is required for validation';

    if (!this.test.nameRus) this.emptyFields.push('название теста (рус)')
    if (!this.test.nameKaz) this.emptyFields.push('название теста (каз)')
    if (!this.test.isLimitless && !this.test.duration) this.emptyFields.push('длительность')
    if (this.test.areasOfActivities.length === 0) {
      this.emptyFields.push('направления деятельности')
    }

    this.test.variants.forEach((_, variantIndex: number): void => {
      this.variantIndex = variantIndex
      this.validateVariant()
    })
  }

  private validateVariant(): void {
    if (this.test === null) throw 'Test is required for validation'
    this.getVariantByIndex().questions.forEach((_, questionIndex: number): void => {
      this.questionIndex = questionIndex
      this.validateQuestion()
    })
  }

  private getVariantByIndex(): VariantToCreate {
    return this.test.variants[this.variantIndex];
  }

  private validateQuestion(): void {
    if (this.test === null) throw 'Test is required for validation'
    const question: QuestionToCreate = this.getQuestionByIndex();

    if (question.withFile && question.file === null) {
      this.emptyFields.push(`файл в вопросе ${this.questionIndex + 1} в варианте ${this.variantIndex + 1}`)
    }
    if (!question.nameRus) this.emptyFields.push(`вопрос (рус) в вопросе ${this.questionIndex + 1}`)
    if (!question.nameKaz) this.emptyFields.push(`вопрос (каз) в вопросе ${this.questionIndex + 1}`)
    if (!question.type) this.emptyFields.push(`тип в вопросе ${this.questionIndex + 1}`)

    if (this.test.type === TestType.withOpenQuestions) return
    this.validateQuestionByType()

    question.options.forEach((option: OptionToCreate, optionIndex: number): void => {
      this.optionIndex = optionIndex
      this.validateOption(option)
    })
  }

  private validateQuestionByType(): void {
    if (this.test === null) throw 'Test is required for validation';
    const question: QuestionToCreate = this.getQuestionByIndex();

    this.validateOptionCount(question)

    if (this.test.type === TestType.withMcqHavingNoCorrect) return

    this.validateCorrectOptionCount()
  }

  private validateOptionCount(
    question: QuestionToCreate,
  ): void {
    if (question.options.length > 1) return
    this.errors.push(
      `не достаточное количество вариантов ответа в вопросе ${this.questionIndex + 1} в варианте ${this.variantIndex + 1}`,
    )
  }

  private validateCorrectOptionCount(): void {
    const correctOptionCount: number = this.countCorrectOptions()
    const validCorrectOptionCount: boolean = this.isCorrectOptionCountValid(correctOptionCount)

    if (validCorrectOptionCount) return;
    this.errors.push(
      `в вопросе ${this.questionIndex + 1} в варианте ${this.variantIndex + 1} должен быть один правильный вариант ответа`,
    )
  }

  private countCorrectOptions(): number {
    if (this.test === null) throw 'Test is required for validation'
    const question: QuestionToCreate = this.getQuestionByIndex();
    return question.options.filter((option: OptionToCreate): boolean => option.isCorrect ?? false)
      .length
  }

  private getQuestionByIndex(): QuestionToCreate {
    return this.getVariantByIndex().questions[this.questionIndex]
  }

  private isCorrectOptionCountValid(
    correctOptionCount: number
  ): boolean {
    if (this.test === null) throw 'Test is required for validation';

    if (this.test.type === TestType.withMcqHavingOneCorrect) {
      return correctOptionCount === 1
    }
    if (this.test.type === TestType.withMcqHavingMultipleCorrect) {
      return correctOptionCount > 1
    }

    return false
  }

  private validateOption(
    option: OptionToCreate,
  ): void {
    if (option.withFile && option.file === null) {
      this.emptyFields.push(
        `файл в варианте ответа ${this.optionIndex + 1} в вопросе ${this.questionIndex + 1} в варианте ${this.variantIndex + 1}`,
      )
    }
    if (!option.nameKaz) {
      this.emptyFields.push(
        `ответ (каз) в варианте ответа ${this.optionIndex + 1} в вопросе ${this.questionIndex + 1} в варианте ${this.variantIndex + 1}`,
      )
    }
    if (!option.nameRus) {
      this.emptyFields.push(
        `ответ (рус) в варианте ответа ${this.optionIndex + 1} в вопросе ${this.questionIndex + 1} в варианте ${this.variantIndex + 1}`,
      )
    }
  }
}
