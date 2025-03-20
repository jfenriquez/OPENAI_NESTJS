interface Options {
  prompt: string;
}

export const orthographyUseCase = async (openai, options: Options) => {
  const { prompt } = options;

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',

    messages: [
      {
        role: 'system',
        content: `Te serán proveídos textos EN ESPAÑOL con posibles errores ortográficos y gramaticales,
        las palabras usadas deben exitir en el diccionario de la Real Academia española,
        Debes de responder en formato JSON, 
        tu tareal es corregirlos y retornar información soluciones,
        también debes de dar un porcentaje de acierto por el usuario, 
        Si no hay errores, debes de retornar un mensaje de felicitaciones
        
        EJEMPLO DE SALIDA :{
        usersScore: number,
        errors:string[],///'error->solucion'
        message:string////puedes utilizar emojis
        }
        `,
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    max_tokens: 60,
  });

  const jsonResp = JSON.parse(completion.choices[0].message.content);
  return {
    data: jsonResp,
  };
};
