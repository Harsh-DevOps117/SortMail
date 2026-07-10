import { optimizeEmailForLLM } from './nlp';

export async function classifyEmail(subject: string, htmlBody: string, hasUnsubscribe: boolean) {
  // Optimize the email body to save LLM tokens using our NLP script
  const optimizedBody = optimizeEmailForLLM(htmlBody || '');
  
  const prompt = `
    You are an AI Email Triage Assistant.
    Analyze the following email and output ONLY valid JSON.
    
    Metadata Hint: has_unsubscribe_header = ${hasUnsubscribe}
    Subject: ${subject}
    Body (Stemmed/Optimized): ${optimizedBody.substring(0, 500)} // Truncated to save tokens
    
    Categorize this email into exactly ONE of the following categories: ["internship", "youtube", "newsletter", "personal", "other"].
    Also determine if the email explicitly requires a human reply (needsReply: true/false).
    
    Output Format:
    {
      "category": "internship",
      "needsReply": true
    }
  `;

  try {
    const response = await fetch('https://api.meshapi.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MESSH_API_KEY}` 
      },
      body: JSON.stringify({
        model: "openai/gpt-4o", // MeshAPI universal routing format
        messages: [{ role: "system", content: prompt }],
        response_format: { type: "json_object" } // Force JSON
      })
    });

    const data = await response.json();
    
    // Parse the JSON output from the LLM
    const resultText = data.choices[0].message.content.trim();
    const cleanJson = resultText.replace(/```json/g, '').replace(/```/g, '');
    const result = JSON.parse(cleanJson);
    
    return {
      category: result.category || 'other',
      needsReply: result.needsReply || false
    };
  } catch (error) {
    console.error("LLM Classification Error:", error);
    // Smart fallback if the LLM fails
    if (hasUnsubscribe) return { category: 'newsletter', needsReply: false };
    return { category: 'other', needsReply: false };
  }
}

export async function generateContextualReply(originalSnippet: string, instructions: string) {
  const prompt = `
    You are an AI Email Assistant. 
    A user has received this email snippet: "${originalSnippet}"
    
    The user wants you to draft a reply to this email based on these instructions: "${instructions}"
    
    Output ONLY valid JSON in the following format:
    {
      "subject": "Re: Your Email",
      "body": "The HTML formatted body of the email reply."
    }
  `;

  try {
    const response = await fetch('https://api.meshapi.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MESSH_API_KEY}` 
      },
      body: JSON.stringify({
        model: "openai/gpt-4o",
        messages: [{ role: "system", content: prompt }],
        response_format: { type: "json_object" }
      })
    });

    const data = await response.json();
    const resultText = data.choices[0].message.content.trim();
    const cleanJson = resultText.replace(/```json/g, '').replace(/```/g, '');
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("LLM Draft Error:", error);
    return { subject: "Re: Update", body: instructions }; 
  }
}

export async function generateBroadcastEmail(instructions: string) {
  const prompt = `
    You are an AI Email Assistant.
    Draft a professional broadcast email based on the following instructions: "${instructions}"
    
    Output ONLY valid JSON in the following format:
    {
      "subject": "Compelling Subject Line",
      "body": "The HTML formatted body of the email."
    }
  `;

  try {
    const response = await fetch('https://api.meshapi.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MESSH_API_KEY}` 
      },
      body: JSON.stringify({
        model: "openai/gpt-4o",
        messages: [{ role: "system", content: prompt }],
        response_format: { type: "json_object" }
      })
    });

    const data = await response.json();
    const resultText = data.choices[0].message.content.trim();
    const cleanJson = resultText.replace(/```json/g, '').replace(/```/g, '');
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("LLM Broadcast Draft Error:", error);
    return { subject: "Update", body: instructions };
  }
}
