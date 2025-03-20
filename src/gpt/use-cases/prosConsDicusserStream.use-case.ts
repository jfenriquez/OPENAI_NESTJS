interface Options {
  prompt: string;
}

export const prosConsDicusserStreamUseCase = async (
  openai,
  options: Options,
) => {
  const { prompt } = options;

  return await openai.chat.completions.create({
    stream: true,
    model: 'gpt-3.5-turbo',

    messages: [
      {
        role: 'system',
        content: `Se te dará una pregunta y tu tarea es dar una respuesta con pros y contras, la respuesta debe de ser en formato json,los pros   y contras deben de estar en una lista,///puedes utilizar emojis `,
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    max_tokens: 500,
    temperature: 0.8,
  });
};
