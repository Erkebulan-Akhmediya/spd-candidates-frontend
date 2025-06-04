import type { EditableOption } from '@/interfaces/option.ts'
import { type EditableQuestion } from '@/interfaces/question.ts'
import { type EditableTest, TestType } from '@/interfaces/test.ts'
import type { EditableVariant } from '@/interfaces/variant.ts'
import type {
  Condition,
  ConditionalSectioningVar,
  Scale,
  ScaleSection,
} from '@/interfaces/test-evaluation.ts'

export default class TestValidatorService {
  private static instance: TestValidatorService

  private emptyFields: string[]
  private errors: string[]
  private test: EditableTest | null
  private scaleIndex: number
  private sectionIndex: number
  private conditionIndex: number
  private variantIndex: number
  private questionIndex: number
  private optionIndex: number

  private constructor() {
    this.emptyFields = []
    this.errors = []
    this.test = null
    this.scaleIndex = 0
    this.sectionIndex = 0
    this.conditionIndex = 0
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

  public validate(test: EditableTest): void {
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
    if (this.test.conditionallySectioned) {
      this.validateConditionalSectioningVars()
    }
  }

  private validateConditionalSectioningVars(): void {
    if (this.test === null) throw 'Test is required for validation'

    const seen: Set<string> = new Set()
    const names: string[] = this.test.conditionalVars.map(
      (condVar: ConditionalSectioningVar): string => condVar.name,
    )
    for (const name of names) {
      if (seen.has(name)) {
        this.errors.push('Названия переменных должны быть уникальными')
        return
      }
      seen.add(name)
    }
  }

  private validateScale(): void {
    if (this.test === null) throw 'Test is required for validation'

    const scale: Scale = this.test.scales[this.scaleIndex]
    if (!scale.nameKaz) this.emptyFields.push(`название (каз) в шкале ${scale.index}`)
    if (!scale.nameRus) this.emptyFields.push(`название (рус) в шкале ${scale.index}`)

    scale.sections.forEach((_, sectionIndex: number): void => {
      this.sectionIndex = sectionIndex
      this.validateSection()
    })
  }

  private validateSection(): void {
    if (this.test === null) throw 'Test is required for validation'

    const section: ScaleSection = this.test.scales[this.scaleIndex].sections[this.sectionIndex]
    section.conditions.forEach((_, conditionIndex: number): void => {
      this.conditionIndex = conditionIndex
      if (this.test!.conditionallySectioned) {
        this.validateCondition()
      }
    })
  }

  private validateCondition(): void {
    if (this.test === null) throw 'Test is required for validation'

    const condition: Condition =
      this.test.scales[this.scaleIndex].sections[this.sectionIndex].conditions[this.conditionIndex]
    const where :string = `в условии ${this.conditionIndex + 1} в секции ${this.sectionIndex + 1} в шкале ${this.scaleIndex + 1}`

    const validOperators: string[] = [
      'equals',
      'not equals',
      'greater',
      'greater or equal',
      'less',
      'less or equal',
      'in',
      'not in',
    ]
    if (!validOperators.includes(condition.operator)) {
      this.errors.push(
        `не верное значние оператора ${where}`,
      )
    }
    if (condition.varName === '') {
      this.emptyFields.push(`переменная ${where} обязательна`)
    }
    if (condition.value.length == 0) {
      this.emptyFields.push(`значение переменной ${where} обязательно`)
    }
  }

  private validateVariant(): void {
    if (this.test === null) throw 'Test is required for validation'
    this.getVariantByIndex().questions.forEach((_, questionIndex: number): void => {
      this.questionIndex = questionIndex
      this.validateQuestion()
    })
  }

  private getVariantByIndex(): EditableVariant {
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
      TestType.withOpenQuestions,
      TestType.fileAnswer,
    ]
    if (typesRequiringNoValidation.includes(this.test.type)) return
    this.validateQuestionByType()

    const question: EditableQuestion = this.getQuestionByIndex()
    question.options.forEach((_, optionIndex: number): void => {
      this.optionIndex = optionIndex
      this.validateOption()
    })
  }

  private validateQuestionFields(): void {
    const question: EditableQuestion = this.getQuestionByIndex()

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
    const question: EditableQuestion = this.getQuestionByIndex()
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
    const question: EditableQuestion = this.getQuestionByIndex()
    return question.options.filter((option: EditableOption): boolean => option.isCorrect ?? false)
      .length
  }

  private getQuestionByIndex(): EditableQuestion {
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
    const option: EditableOption = this.getOptionByIndex()
    const emptyFieldLocation: string = `в варианте ответа ${this.optionIndex + 1} в вопросе ${this.questionIndex + 1} в варианте ${this.variantIndex + 1}`
    if (option.withFile && option.file === null) this.emptyFields.push(`файл ${emptyFieldLocation}`)
    if (!option.nameKaz) this.emptyFields.push(`ответ (каз) ${emptyFieldLocation}`)
    if (!option.nameRus) this.emptyFields.push(`ответ (рус) ${emptyFieldLocation}`)
  }

  private getOptionByIndex(): EditableOption {
    return this.getQuestionByIndex().options[this.optionIndex]
  }
}
