interface Options {
  prompt: string;
  lang: string;
}

export const translateUseCase = async (openai, options: Options) => {
  const { prompt, lang } = options;

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',

    messages: [
      {
        role: 'system',
        content: `Traduce el siguiente texto al idioma ${lang}:${prompt}
        dame la respuesta en formato JSON
        EJEMPLO: {"traduccion": "Hola Mundo"}
        `,
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.5,
    max_tokens: 60,
  });

  ///return completion.choices[0].message.content;
  const jsonResp = JSON.parse(completion.choices[0].message.content);
  return {
    data: jsonResp,
  };
};
