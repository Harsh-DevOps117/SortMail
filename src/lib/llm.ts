import { optimizeEmailForLLM } from './nlp';

export async function classifyEmail(subject: string, htmlBody: string, hasUnsubscribe: boolean) {
  const optimizedBody = optimizeEmailForLLM(htmlBody || '');

    const prompt = `
    You are an AI Email Triage Assistant.
    Analyze the following email and output ONLY valid JSON.
    
    Metadata Hint: has_unsubscribe_header = ${hasUnsubscribe}
    Subject: ${subject}
    Body (Stemmed/Optimized): ${optimizedBody.substring(0, 500)} // Truncated to save tokens
    
    Categorize this email into exactly ONE of the following categories: ["internship", "youtube", "newsletter", "personal", "social", "finance", "security", "other"].
    
    IMPORTANT RULES:
    1. "security": Use this for legitimate security alerts, 2FA codes, new login notifications, and password resets from verified companies (Google, Microsoft, Github, banks, etc).
    2. "needsReply" (Needs Action): Set this to TRUE **ONLY** if the email has an urgent deadline, requires immediate attention, asks for a time-sensitive response, or is a friend/family member requesting urgent financial help (money). General chit-chat or informational emails should be FALSE.
    
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
        model: "openai/gpt-4o", 
        messages: [{ role: "system", content: prompt }],
        response_format: { type: "json_object" } 
      })
    });

    const data = await response.json();

    const resultText = data.choices[0].message.content.trim();
    const cleanJson = resultText.replace(/```json/g, '').replace(/```/g, '');
    const result = JSON.parse(cleanJson);

        return {
      category: result.category || 'other',
      needsReply: result.needsReply || false
    };
  } catch (error) {
    console.error("LLM Classification Error:", error);
    if (hasUnsubscribe) return { category: 'newsletter', needsReply: false };
    return { category: 'other', needsReply: false };
  }
}

export async function generateContextualReply(originalSnippet: string, instructions: string, senderDetails: string, receiverDetails: string) {
  const prompt = `
    You are an AI Email Assistant. 
    You are drafting a reply on behalf of: ${receiverDetails}.
    You are replying to an email sent by: ${senderDetails}.
    
    A user has received this email snippet: "${originalSnippet}"
    
    The user wants you to draft a reply to this email based on these instructions: "${instructions}"
    
    IMPORTANT: Do not use placeholders like [Recipient Name] or [Your Name]. Use the actual sender and receiver details provided above. If the exact name is unknown, infer it from the email addresses or use a generic, natural greeting/sign-off without brackets.
    
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
