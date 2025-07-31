
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function tailorResume(resume: string, jobDescription: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
    Tailor the following resume to the job description provided.
    Resume:
    ${resume}

    Job Description:
    ${jobDescription}
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  return text;
}
