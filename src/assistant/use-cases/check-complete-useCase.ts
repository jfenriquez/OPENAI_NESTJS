import OpenAI from 'openai';
import { resolve } from 'path';

interface Options {
  threadId: string;
  runId?: string;
}

export const checkCompletedUseCase = async (
  options: Options,
  openai: OpenAI,
) => {
  const { threadId, runId } = options;

  const runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);

  if (runStatus.status === 'completed') {
    return runStatus;
  }
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return await checkCompletedUseCase(options, openai);
};
