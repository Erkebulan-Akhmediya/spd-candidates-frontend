import type { EditableOption, SendableOption } from '@/interfaces/option.ts'
import type { EditableQuestion, SendableQuestion } from '@/interfaces/question.ts'
import type { EditableVariant, SendableVariant } from '@/interfaces/variant.ts'
import { type EditableTest, type SendableTest } from '@/interfaces/test.ts'
import type FileService from '@/services/FileService.ts'

export default class TestConverterService {
  private static instance: TestConverterService

  private constructor(private readonly file: FileService) {
  }

  public static getInstance(file: FileService): TestConverterService {
    if (!TestConverterService.instance) {
      TestConverterService.instance = new TestConverterService(file)
    }
    return TestConverterService.instance
  }

  public async convertTestToSend(test: EditableTest): Promise<SendableTest> {
    return {
      ...test,
      variants: await Promise.all(test.variants.map(this.convertVariantToSend.bind(this))),
    }
  }

  private async convertVariantToSend(variant: EditableVariant): Promise<SendableVariant> {
    return {
      ...variant,
      questions: await Promise.all(variant.questions.map(this.convertQuestionToSend.bind(this))),
    }
  }

  private async convertQuestionToSend(question: EditableQuestion): Promise<SendableQuestion> {
    return {
      ...question,
      fileName: question.withFile && question.file!.size > 0 ? await this.file.upload(question.file!) : null,
      options: await Promise.all(question.options.map(this.convertOptionToSend.bind(this))),
    }
  }

  private async convertOptionToSend(option: EditableOption): Promise<SendableOption> {
    return {
      ...option,
      fileName: option.withFile && option.file!.size > 0 ? await this.file.upload(option.file!) : null,
    }
  }

  public async convertTestToEdit(test: SendableTest): Promise<EditableTest> {
    return {
      ...test,
      isLimitless: Boolean(test.isLimitless),
      variants: await Promise.all(test.variants.map(this.convertVariantToEdit.bind(this))),
    }
  }

  private async convertVariantToEdit(variant: SendableVariant): Promise<EditableVariant> {
    return {
      ...variant,
      questions: await Promise.all(variant.questions.map(this.convertQuestionToEdit.bind(this))),
    }
  }

  private async convertQuestionToEdit(question: SendableQuestion): Promise<EditableQuestion> {
    return {
      ...question,
      file: question.withFile ? new File([], question.fileName!) : null,
      options: await Promise.all(question.options.map(this.convertOptionToEdit.bind(this)))
    }
  }

  private async convertOptionToEdit(option: SendableOption): Promise<EditableOption> {
    return {
      ...option,
      file: option.withFile ? new File([], option.fileName!) : null
    }
  }

}
