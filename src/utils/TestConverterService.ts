import type { OptionToCreate, OptionToSend } from '@/interfaces/option.ts'
import type { QuestionToCreate, QuestionToSend } from '@/interfaces/question.ts'
import type { VariantToCreate, VariantToSend } from '@/interfaces/variant.ts'
import type { TestToCreate, TestToSend } from '@/interfaces/test.ts'
import type FileService from '@/utils/FileService.ts'

export default class TestConverterService {

  private static instance: TestConverterService;

  private constructor(private readonly file: FileService) {}

  public static getInstance(file: FileService): TestConverterService {
    if (!TestConverterService.instance) {
      TestConverterService.instance = new TestConverterService(file)
    }
    return TestConverterService.instance
  }

  public async convertTestToSend(test: TestToCreate): Promise<TestToSend> {
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
    return {
      ...question,
      fileName: question.withFile ? await this.file.upload(question.file!) : null,
      options: await Promise.all(question.options.map(this.convertOptionToSend.bind(this))),
    }
  }

  private async convertOptionToSend(option: OptionToCreate): Promise<OptionToSend> {
    return {
      ...option,
      fileName: option.withFile ? await this.file.upload(option.file!) : null,
    }
  }

}
