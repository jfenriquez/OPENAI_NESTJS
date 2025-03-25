import OpenAI from 'openai';

export const createThreadsUseCase = async (
  //options: Options,
  openai: OpenAI,
) => {
  //const { threadId, question } = options;

  const thread = await openai.beta.threads.create();
  return thread;
};
