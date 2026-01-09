import { AzureOpenAI } from "openai" 


export const client = new AzureOpenAI({
    endpoint:process.env.OPEN_API_ENDPOINT,
    apiKey:process.env.OPEN_API_KEY,
    deployment:process.env.OPEN_API_DEPLOYMENT_NAME,
    apiVersion:process.env.OPEN_API_VERSION
})