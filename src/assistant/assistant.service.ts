import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { createThreadsUseCase } from './use-cases/create-threads-useCase';
import { QuestionDto } from './dtos/question.dto';
import { createMessageUseCase } from './use-cases/create-message-useCase';
import { createRunUseCase } from './use-cases/create-run-useCase';
import { getMessageListUseCase } from './use-cases/get-message-list-useCase';
import { checkCompletedUseCase } from './use-cases/check-complete-useCase';

@Injectable()
export class AssistantService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async createThread() {
    return await createThreadsUseCase(this.openai);
  }

  async userQuestion(questionDto: QuestionDto) {
    const { question, threadId } = questionDto;
    ///crear mensaje
    const message = await createMessageUseCase(
      { question, threadId },
      this.openai,
    );
    ///crear run
    const run = await createRunUseCase({ threadId }, this.openai);

    await checkCompletedUseCase(
      { threadId: threadId, runId: run.id },
      this.openai,
    );
    ///obtener respueta de  open
    const messages = await getMessageListUseCase({ threadId }, this.openai);
    return messages.reverse();
  }
}
