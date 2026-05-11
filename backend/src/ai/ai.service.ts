import { Injectable } from '@nestjs/common';

@Injectable()
export class AiService {
  private async callYandexGPT(prompt: string, maxTokens: number): Promise<string> {
    const apiKey = process.env.YANDEX_API_KEY;
    const folderId = process.env.YANDEX_FOLDER_ID;

    if (!apiKey || !folderId) throw new Error('YANDEX_API_KEY or YANDEX_FOLDER_ID is not set');

    const response = await fetch(
      'https://llm.api.cloud.yandex.net/foundationModels/v1/completion',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Api-Key ${apiKey}`,
          'x-folder-id': folderId,
        },
        body: JSON.stringify({
          modelUri: `gpt://${folderId}/yandexgpt-lite/latest`,
          completionOptions: {
            stream: false,
            temperature: 0.6,
            maxTokens,
          },
          messages: [{ role: 'user', text: prompt }],
        }),
      },
    );

    if (!response.ok) throw new Error(`YandexGPT error: ${response.status}`);

    const data = await response.json() as {
      result: { alternatives: { message: { text: string } }[] };
    };

    return data.result.alternatives[0]?.message?.text ?? '';
  }

  async generate(category: string): Promise<string> {
    const prompts: Record<string, string> = {
      'Что приготовить': 'Предложи одно конкретное блюдо для приготовления. Напиши только название блюда и одно предложение — почему оно вкусное или чем интересно. Без списков и заголовков.',
      'Куда пойти':      'Предложи одно конкретное место для посещения (кафе, парк, музей, район города и т.д.). Напиши только название и одно предложение — чем оно интересно. Без списков.',
      'Что посмотреть':  'Предложи один конкретный фильм или сериал для просмотра. Напиши только название и одно предложение о нём. Без списков.',
      'Чем заняться':    'Предложи одно конкретное занятие на сегодняшний вечер. Напиши только название и одно предложение почему это стоит попробовать.',
      'Цели':            'Предложи одну конкретную небольшую цель, которую реально достичь за месяц. Напиши только формулировку цели и одно предложение почему она полезна.',
    };
    const prompt = prompts[category]
      ?? `Предложи одну оригинальную идею для категории "${category}". Напиши только название идеи и одно предложение описания.`;

    try {
      return await this.callYandexGPT(prompt, 150);
    } catch {
      return 'Не удалось получить идею от ИИ.';
    }
  }

  async enrich(itemName: string, category: string): Promise<string> {
    const prompts: Record<string, string> = {
      'Что приготовить': `Дай краткий рецепт блюда "${itemName}": ингредиенты и шаги приготовления. Ответ не более 200 слов.`,
      'Куда пойти':      `Расскажи кратко о месте "${itemName}": чем интересно и как добраться. Ответ не более 150 слов.`,
      'Что посмотреть':  `Кратко опиши фильм или сериал "${itemName}": жанр, год, о чём сюжет. Ответ не более 150 слов.`,
      'Чем заняться':    `Дай 3 практических совета, как начать заниматься "${itemName}". Ответ не более 150 слов.`,
      'Цели':            `Составь план первых 3 шагов для достижения цели "${itemName}". Ответ не более 150 слов.`,
    };
    const prompt = prompts[category] ?? `Расскажи кратко о "${itemName}". Ответ не более 150 слов.`;

    try {
      return await this.callYandexGPT(prompt, 400);
    } catch {
      return 'Не удалось получить информацию от ИИ.';
    }
  }
}
