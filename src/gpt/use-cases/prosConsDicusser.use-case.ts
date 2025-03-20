interface Options {
  prompt: string;
}

export const prosConsDicusserUseCase = async (openai, options: Options) => {
  const { prompt } = options;

  const completion = await openai.chat.completions.create({
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

  const jsonResp = JSON.parse(completion.choices[0].message.content);
  return {
    data: jsonResp,
  };
};
