import { getModel } from "../config/llmModels"

export const router = async (state) => {
    const llm = await getModel("router");

    const prompt = `
You are a routing agent for a multi-agent AI system.

Your job is to analyze the user's request and decide which specialized agent should handle it.

Available agents:

1. chat
   - General conversation
   - General questions
   - Explanations
   - Writing, rewriting, summarization
   - Questions that do not require a specialized agent

2. search
   - Requests that require web/internet search
   - Latest or current information
   - News
   - Finding websites, products, companies, people, or external information
   - Questions where up-to-date information is required

3. ppt
   - Creating PowerPoint presentations
   - Editing or improving presentations
   - Generating presentation slides
   - Requests involving PPT/PPTX files

4. coding
   - Writing code
   - Debugging code
   - Fixing programming errors
   - Explaining code
   - Software architecture
   - Programming questions
   - Requests involving programming languages, frameworks, APIs, databases, Docker, Git, etc.

5. pdf
   - Creating PDFs
   - Reading, analyzing, summarizing, or extracting information from PDF documents
   - Editing or processing PDF files
   - Requests specifically involving PDF documents

6. vision
   - Processing or understanding images
   - Analyzing screenshots
   - Object/image recognition
   - Extracting information from images
   - Describing images
   - Image-based questions
   - Visual understanding tasks

Routing rules:
- Choose exactly ONE agent.
- Select the most specialized agent for the user's request.
- If the request requires current internet information, choose search.
- If the request is about programming or code, choose coding.
- If the request involves a PowerPoint presentation, choose ppt.
- If the request involves a PDF document, choose pdf.
- If the request involves an image or screenshot, choose vision.
- Otherwise, choose chat.

Return ONLY the agent name.
Do not provide explanations.
Do not use markdown.

User request:
${state.messages[state.messages.length - 1].content}
`;

    const response = await llm.invoke(prompt);
    console.log("response", response);
    

    return {
        ...state,
        nextAgent: response.content.trim().toLowerCase()
    };
};