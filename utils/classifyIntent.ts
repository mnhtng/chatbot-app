const classifyIntent = async (prompt: string) => {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            // "model": "deepseek/deepseek-r1:free",
            "model": "deepseek/deepseek-r1-0528-qwen3-8b:free",
            "messages": [
                {
                    role: 'system',
                    content: `You are a helpful assistant that classifies intent of user prompts.`,
                },
                {
                    role: 'user',
                    content: `
                        Classify the following message into one of the intents:

                        - greeting
                        - education
                        - coding
                        - life advice
                        - translation
                        - search
                        - chat random
                        - entertainment
                        - news
                        - weather
                        - health
                        - finance
                        - travel
                        - shopping
                        - technology
                        - other

                        Only return the intent name, nothing else.

                        Message: "${prompt}"
                    `,
                },
            ],
            temperature: 0, // 0: deterministic, 1: random
            max_tokens: 100,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            stop: null,
            stream: false,
            logprobs: null,
            logit_bias: null,
            return_metadata: null,
            tools: [
                {
                    type: "function",
                    function: {
                        name: "classify_intent",
                        description: "Classify the intent of the user prompt",
                        parameters: {
                            type: "object",
                            properties: {
                                intent: {
                                    type: "string",
                                    description: "The intent of the user prompt",
                                    enum: [
                                        "greeting",
                                        "education",
                                        "coding",
                                        "life advice",
                                        "translation",
                                        "search",
                                        "chat random",
                                        "entertainment",
                                        "news",
                                        "weather",
                                        "health",
                                        "finance",
                                        "travel",
                                        "shopping",
                                        "technology",
                                        "other"
                                    ]
                                }
                            }
                        }
                    }
                }
            ],
            tool_choice: {
                type: "function",
                function: {
                    name: "classify_intent"
                }
            },
            response_format: null,
            seed: null,
            user: null,
            n: 1,
            stream_options: null,
        })
    })

    const data = await response.json()

    return data.choices[0]?.message?.content || 'other'
}

export default classifyIntent
