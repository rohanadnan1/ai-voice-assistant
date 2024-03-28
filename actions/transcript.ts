"use server";

import {
  AzureKeyCredential,
  ChatRequestMessage,
  OpenAIClient,
} from "@azure/openai";

async function transcript(prevState: any, formData: FormData) {
  const id = Math.random().toString(36);
  const azureKey = process.env.AZURE_KEY;
  const azureEndpoint = process.env.AZURE_ENDPOINT;
  const azureDeploymentName = process.env.AZURE_DEPLOYMENT_NAME;
  const azureDeploymentCompletionsName =
    process.env.AZURE_DEPLOYMENT_COMPLETION_NAME;
  if (
    azureKey === undefined ||
    azureEndpoint === undefined ||
    azureDeploymentName === undefined ||
    azureDeploymentCompletionsName === undefined
  ) {
    throw new Error("Missing environment variables");
  }

  const file = formData.get("audio") as File;
  if (file === null || file.size === 0) {
    throw new Error("No audio file found");
  }

  const arrayBuffer = await file.arrayBuffer();
  const audio = new Uint8Array(arrayBuffer);

  const client = new OpenAIClient(
    azureEndpoint,
    new AzureKeyCredential(azureKey)
  );

  const result = await client.getAudioTranscription(azureDeploymentName, audio);
  console.log(`Transcription: ${result.text}`);

  const messages: ChatRequestMessage[] = [
    {
      role: "system",
      content:
        "You are Rohan's AI assistant. You will answer questions and reply I cannot answer that if you dont know the answer.",
    },
    { role: "user", content: result.text },
  ];

  const completions = await client.getChatCompletions(
    azureDeploymentCompletionsName,
    messages,
    { maxTokens: 128 }
  );

  const response = completions.choices[0].message?.content;

  return {
    sender: result.text,
    response: response,
    id,
  };
}

export default transcript;
