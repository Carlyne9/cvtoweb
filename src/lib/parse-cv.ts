import OpenAI from 'openai';
import { PortfolioData } from '@/types/portfolio';

export async function parseCV(cvText: string): Promise<PortfolioData> {
  const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: process.env.DEEPSEEK_API_KEY || "dummy_key_to_prevent_build_crash",
  });

  const prompt = `You are a CV/resume parser. Extract the following information from the CV text and return it as valid JSON only, with no additional text or explanation.

The JSON structure must be:
{
  "name": "Full name",
  "title": "Professional title/headline",
  "summary": "Professional summary or objective (create one if not present)",
  "experience": [
    {
      "company": "Company name",
      "role": "Job title",
      "dates": "Date range (e.g., Jan 2020 - Present)",
      "location": "City, Country (if available)",
      "bullets": ["Achievement or responsibility 1", "Achievement 2"]
    }
  ],
  "education": [
    {
      "institution": "School/University name",
      "degree": "Degree type (e.g., Bachelor's, Master's)",
      "field": "Field of study",
      "dates": "Date range",
      "location": "City, Country (if available)"
    }
  ],
  "skills": ["Skill 1", "Skill 2", "Skill 3"],
  "contact": {
    "email": "email@example.com",
    "phone": "+1234567890",
    "linkedin": "linkedin.com/in/username",
    "website": "website.com",
    "location": "City, Country"
  }
}

If any field is not found in the CV, use an empty string or empty array as appropriate. Do not make up information that isn't in the CV, except for the summary which you can craft based on the experience and skills if one isn't provided.

CV Text:
${cvText}

Respond with only valid JSON, no markdown code blocks, no explanation.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 4096,
    });

    const text = completion.choices[0]?.message?.content || '';

    // Remove markdown code blocks if present
    let jsonText = text.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }

    try {
      const parsed = JSON.parse(jsonText) as PortfolioData;
      return parsed;
    } catch (parseError) {
      console.error('Failed to parse DeepSeek response as JSON:', jsonText, parseError);
      throw new Error('Failed to parse AI response as JSON');
    }
  } catch (apiError) {
    console.error('DeepSeek API Error:', apiError);
    throw new Error('Failed to generate portfolio data from CV');
  }
}
