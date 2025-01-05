import {
  streamText,
  createDataStreamResponse,
  Message,
  convertToCoreMessages,
  generateId,
  JSONValue,
  ToolInvocation
} from 'ai'
import { researcher } from '@/lib/agents/researcher'
import { generateRelatedQuestions } from '@/lib/agents/generate-related-questions'
import { cookies } from 'next/headers'
import { getChat, saveChat } from '@/lib/actions/chat'

export const maxDuration = 30

const DEFAULT_MODEL = 'openai:gpt-4o-mini'

export async function POST(req: Request) {
  const { messages, id: chatId } = await req.json()

  const coreMessages = convertToCoreMessages(messages)
  const cookieStore = await cookies()
  const modelFromCookie = cookieStore.get('selected-model')?.value
  const model = modelFromCookie || DEFAULT_MODEL

  return createDataStreamResponse({
    execute: dataStream => {
      const researcherConfig = researcher({
        messages: coreMessages,
        model
      })

      let toolResults: ToolInvocation[] = []
      const result = streamText({
        ...researcherConfig,
        onStepFinish(event) {
          // onFinish's event.toolResults is empty. Use onStepFinish to get the tool results.
          if (event.stepType === 'initial') {
            toolResults = event.toolResults
          }
        },
        onFinish: async event => {
          const responseMessages = event.response.messages

          let annotation: JSONValue = {
            type: 'related-questions',
            data: {
              items: []
            },
            status: 'loading'
          }

          // Notify related questions loading
          dataStream.writeMessageAnnotation(annotation)

          // Generate related questions
          const relatedQuestions = await generateRelatedQuestions(
            responseMessages,
            model
          )

          // Update the annotation with the related questions
          annotation = {
            ...annotation,
            data: relatedQuestions.object,
            status: 'done'
          }

          // Send related questions to client
          dataStream.writeMessageAnnotation(annotation)

          // Create the message to save
          const generatedMessage: Message = {
            role: 'assistant',
            content: event.text,
            toolInvocations: toolResults,
            annotations: [annotation],
            id: generateId()
          }

          // Get the chat from the database if it exists, otherwise create a new one
          const savedChat = (await getChat(chatId)) ?? {
            messages: [],
            createdAt: new Date(),
            userId: 'anonymous',
            path: `/search/${chatId}`,
            title: messages[0].content,
            id: chatId
          }

          // Save chat with complete response and related questions
          await saveChat({
            ...savedChat,
            messages: [...savedChat.messages, generatedMessage]
          })
        }
      })

      result.mergeIntoDataStream(dataStream)
    },
    onError: error => {
      console.error('Error:', error)
      return error instanceof Error ? error.message : String(error)
    }
  })
}
