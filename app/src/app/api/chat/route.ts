import OpenAI from 'openai'
import { NextRequest } from 'next/server'
import { MCP_TOOLS } from '@/lib/mcp-tools'
import { MCPToolExecutor } from '@/lib/mcp-executor'

interface ToolCall {
  id: string | undefined
  type: string
  function: {
    name: string
    arguments: string
  }
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { messages, options = {} } = await request.json()

    const toolExecutor = new MCPToolExecutor()

    console.log(MCP_TOOLS)

    const stream = await openai.chat.completions.create({
      model: options.model || process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages,
      max_tokens: options.maxTokens || 1000,
      temperature: options.temperature || 0.7,
      stream: true,
      tools: MCP_TOOLS.map((tool) => ({
        type: 'function' as const,
        function: {
          name: tool.name,
          description: tool.description,
          parameters: tool.parameters,
        },
      })),
      tool_choice: 'auto',
    })
    console.log(messages)

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          const toolCalls: ToolCall[] = []

          for await (const chunk of stream) {
            const delta = chunk.choices[0]?.delta

            // Handle tool calls
            if (delta?.tool_calls) {
              for (const toolCall of delta.tool_calls) {
                if (toolCall.index !== undefined) {
                  if (!toolCalls[toolCall.index]) {
                    toolCalls[toolCall.index] = {
                      id: toolCall.id,
                      type: 'function',
                      function: { name: '', arguments: '' },
                    }
                  }

                  if (toolCall.function?.name) {
                    toolCalls[toolCall.index].function.name +=
                      toolCall.function.name
                  }
                  if (toolCall.function?.arguments) {
                    toolCalls[toolCall.index].function.arguments +=
                      toolCall.function.arguments
                  }
                }
              }
            }

            // Handle regular content - nly send if it's not null/empty
            const content = delta?.content
            if (content) {
              const data = JSON.stringify({
                text: content,
                isComplete: false,
              })
              controller.enqueue(encoder.encode(`data: ${data}\n\n`))
            }

            // Handle completion
            if (chunk.choices[0]?.finish_reason === 'tool_calls') {
              console.log('Tool calls detected:', toolCalls)

              // Execute tools and get results
              const toolResults = []
              for (const toolCall of toolCalls) {
                try {
                  const args = JSON.parse(toolCall.function.arguments)
                  console.log(
                    `Executing tool: ${toolCall.function.name} with args:`,
                    args
                  )
                  const result = await toolExecutor.executeTool(
                    toolCall.function.name,
                    args
                  )

                  toolResults.push({
                    tool_call_id: toolCall.id,
                    role: 'tool',
                    content: JSON.stringify(result.data || result), // ← Fixed: handle both formats
                  })
                } catch (error) {
                  console.error('Tool execution error:', error)
                  toolResults.push({
                    tool_call_id: toolCall.id,
                    role: 'tool',
                    content: JSON.stringify({ error: 'Tool execution failed' }),
                  })
                }
              }

              // Send tool results back to OpenAI for final response
              const followUpMessages = [
                ...messages,
                {
                  role: 'assistant',
                  content: '', // ← Fixed: use empty string instead of null
                  tool_calls: toolCalls,
                },
                ...toolResults,
              ]

              console.log('Sending follow-up messages with tool results')

              // Get final response with tool results
              const finalStream = await openai.chat.completions.create({
                model: options.model || 'gpt-4o-mini',
                messages: followUpMessages,
                stream: true,
                tools: MCP_TOOLS.map((tool) => ({
                  type: 'function' as const,
                  function: {
                    name: tool.name,
                    description: tool.description,
                    parameters: tool.parameters,
                  },
                })), // ← Keep tools available for potential follow-up calls
              })

              for await (const finalChunk of finalStream) {
                const finalContent = finalChunk.choices[0]?.delta?.content
                if (finalContent) {
                  const data = JSON.stringify({
                    text: finalContent,
                    isComplete: false,
                  })
                  controller.enqueue(encoder.encode(`data: ${data}\n\n`))
                }

                if (finalChunk.choices[0]?.finish_reason) {
                  const data = JSON.stringify({
                    text: '',
                    isComplete: true,
                  })
                  controller.enqueue(encoder.encode(`data: ${data}\n\n`))
                  return
                }
              }
            }

            if (chunk.choices[0]?.finish_reason === 'stop') {
              const data = JSON.stringify({
                text: '',
                isComplete: true,
              })
              controller.enqueue(encoder.encode(`data: ${data}\n\n`))
              return
            }
          }
        } catch (error) {
          console.error('Stream processing error:', error)
          const errorData = JSON.stringify({
            error: error instanceof Error ? error.message : 'OpenAI API error',
            isComplete: true,
          })
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`))
        } finally {
          controller.close()
        }
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    console.error('API route error:', error)
    return Response.json(
      { error: error instanceof Error ? error.message : 'API error' },
      { status: 500 }
    )
  }
}
