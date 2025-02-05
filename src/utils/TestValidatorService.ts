import type { OptionToCreate } from '@/interfaces/option.ts'
import { type QuestionToCreate, QuestionType } from '@/interfaces/question.ts'
import type { VariantToCreate } from '@/interfaces/variant.ts'
import type { TestToCreate } from '@/interfaces/test.ts'

export default class TestValidatorService {
  private emptyFields: string[]
  private errors: string[]
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
    this.validateTest(test)

    if (this.emptyFields.length > 0) {
      throw `следующие поля не заполнены: ${this.emptyFields.join(', ')}`
    }
    if (this.errors.length > 0) {
      throw `возникли следующие ошибки: ${this.errors.join(', ')}`
    }
  }

  private validateTest(test: TestToCreate): void {
    if (!test.nameRus) this.emptyFields.push('название теста (рус)')
    if (!test.nameKaz) this.emptyFields.push('название теста (каз)')
    if (!test.isLimitless && !test.duration) this.emptyFields.push('длительность')
    if (test.areasOfActivities.length === 0) {
      this.emptyFields.push('направления деятельности')
    }

    test.variants.forEach((variant: VariantToCreate, variantIndex: number): void => {
      this.variantIndex = variantIndex
      this.validateVariant(variant)
    })
  }

  private validateVariant(variant: VariantToCreate): void {
    variant.questions.forEach((question: QuestionToCreate, questionIndex: number): void => {
      this.questionIndex = questionIndex
      this.validateQuestion(question)
    })
  }

  private validateQuestion(
    question: QuestionToCreate,
  ): void {
    if (question.withFile && question.file === null) {
      this.emptyFields.push(`файл в вопросе ${this.questionIndex + 1} в варианте ${this.variantIndex + 1}`)
    }
    if (!question.nameRus) this.emptyFields.push(`вопрос (рус) в вопросе ${this.questionIndex + 1}`)
    if (!question.nameKaz) this.emptyFields.push(`вопрос (каз) в вопросе ${this.questionIndex + 1}`)
    if (!question.type) this.emptyFields.push(`тип в вопросе ${this.questionIndex + 1}`)

    this.validateQuestionByType(question)

    question.options.forEach((option: OptionToCreate, optionIndex: number): void => {
      this.optionIndex = optionIndex
      this.validateOption(option)
    })
  }

  private validateQuestionByType(
    question: QuestionToCreate
  ): void {
    if (question.type === QuestionType.withoutAnswer || question.type === QuestionType.open) {
      question.options = []
      return
    }

    this.validateOptionCount(question)
    const correctOptionCount: number = this.countCorrectOptions(question)
    const invalidCorrectOptionCount: boolean = this.isCorrectOptionCountValid(question, correctOptionCount)

    if (invalidCorrectOptionCount) {
      this.errors.push(
        `в вопросе ${this.questionIndex + 1} в варианте ${this.variantIndex + 1} должен быть один правильный вариант ответа`,
      )
    }
  }

  private validateOptionCount(
    question: QuestionToCreate,
  ): void {
    if (question.options.length > 1) return
    this.errors.push(
      `не достаточное количество вариантов ответа в вопросе ${this.questionIndex + 1} в варианте ${this.variantIndex + 1}`,
    )
  }

  private countCorrectOptions(question: QuestionToCreate): number {
    return question.options.filter((option: OptionToCreate): boolean => option.isCorrect ?? false)
      .length
  }

  private isCorrectOptionCountValid(
    question: QuestionToCreate,
    correctOptionCount: number
  ): boolean {
    if (question.type === 4) return correctOptionCount !== 1
    if (question.type === 5) return correctOptionCount < 2
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
