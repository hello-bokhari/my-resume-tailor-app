
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function tailorResume(resume: string, jobDescription: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
    You are an AI assistant specialized in tailoring resumes to job descriptions.
    Given the following resume and job description, perform the following tasks:
    1. Rewrite the resume to better match the job description. Do not add any information that is not present in the original resume.
    2. Provide a match score out of 100, indicating how well the original resume aligns with the job description.
    3. Suggest specific steps the user can take to improve their skillset or experience to better fit the job description.

    Return the output as a JSON object with the following keys:
    - tailoredResume: The rewritten resume.
    - matchScore: The match score (integer between 0 and 100).
    - improvementSuggestions: An array of strings, each suggesting an improvement.

    Resume:
    ${resume}

    Job Description:
    ${jobDescription}
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  try {
    // Remove markdown code block if present
    let cleanedText = text.replace(/```json\n/g, '').replace(/\n```/g, '');
    const parsedResponse = JSON.parse(cleanedText);
    return parsedResponse;
  } catch (error) {
    console.error('Error parsing Gemini response:', error);
    console.error('Raw Gemini response:', text);
    throw new Error('Failed to parse Gemini response.');
  }
}
