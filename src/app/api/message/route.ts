import { chatbotPrompt } from '@/app/helpers/constants/chatbot-prompt';
import {
  ChatGPTMessage,
  OpenAIStream,
  OpenAIStreamPayload,
} from '@/lib/openai-stream';
import { MessageArraySchema } from '@/lib/validators/message';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const parsedMessages = MessageArraySchema.parse(messages);

  const outbondMessages: ChatGPTMessage[] = parsedMessages.map((message) => ({
    role: message.isUserMessage ? 'user' : 'system',
    content: message.text,
  }));

  outbondMessages.unshift({
    role: 'system',
    content: chatbotPrompt,
  });

  const payload: OpenAIStreamPayload = {
    model: 'gpt-3.5-turbo',
    messages: outbondMessages,
    temperature: 0.4,
    top_p: 1,
    frequency_penalty: 0,
    prescence_penalty: 0,
    max_tokens: 150,
    stream: true,
    n: 1,
  };

  const stream = await OpenAIStream(payload);

  return new Response(stream);
}
