import OpenAI from 'openai';

interface Options {
  threadId: string;
  assistantId?: string;
}

export const createRunUseCase = async (options: Options, openai: OpenAI) => {
  const { threadId, assistantId = 'asst_Cpu3LBwJOqBTHl6Gxqp3DHA6' } = options;

  const run = await openai.beta.threads.runs.create(threadId, {
    assistant_id: assistantId,
    ///instructions,
  });

  console.log(run);
  return run;
};
