import { GoogleGenAI, Content, Type } from "@google/genai";
import { Course, Module, Lesson } from "../types.ts";

const apiKey = process.env.API_KEY;
if (!apiKey) {
    console.warn("API_KEY environment variable not set. Using a placeholder.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || " " });

const model = 'gemini-2.5-flash';

const tutorSystemInstruction = "You are an expert AI learning assistant for a platform called E-Learnify. Your name is Genu. Be encouraging, helpful, and clear. Your goal is to be a comprehensive learning companion, acting as a mentor and study buddy. Format your responses using markdown for readability.";

export const getTutorResponse = async (prompt: string, history: Content[]): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: [...history, { role: "user", parts: [{ text: prompt }] }],
            config: { systemInstruction: tutorSystemInstruction }
        });
        return response.text;
    } catch (error) {
        console.error('Error getting AI tutor response:', error);
        return 'Sorry, I encountered an error. Please try again.';
    }
};


export const generateCourseOutline = async (courseTitle: string, imagePool: string[]): Promise<Module[]> => {
    try {
        const prompt = `
            You are an expert instructional designer creating a curriculum for an online course titled "${courseTitle}" on the E-Learnify platform.
            Your task is to generate a realistic, structured, multi-week course outline.

            Guidelines:
            1.  Structure the course into a logical sequence of 4 to 6 weekly modules. Each module title MUST be "Week X: [Topic]".
            2.  For each weekly module, create 3-5 individual lesson titles.
            3.  The LAST lesson of each week MUST be an assessment (either a "Quiz" or a "Project").
            4.  For each module, you MUST select the most contextually relevant image URL from the provided image pool. Do not invent new URLs.
            5.  The final output must be a clean JSON object matching the provided schema, with no extra text or explanations.

            Image Pool:
            ${JSON.stringify(imagePool)}
        `;

        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.STRING },
                            title: { type: Type.STRING },
                            imageUrl: { type: Type.STRING },
                            lessons: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        id: { type: Type.STRING },
                                        title: { type: Type.STRING },
                                        isAssessment: { type: Type.BOOLEAN }
                                    },
                                    required: ["id", "title", "isAssessment"]
                                }
                            }
                        },
                        required: ["id", "title", "imageUrl", "lessons"]
                    }
                }
            }
        });

        const parsedResponse = JSON.parse(response.text);

        // Post-process to add the 'completed' flag to lessons
        return parsedResponse.map((module: Module) => ({
            ...module,
            lessons: module.lessons.map((lesson: Omit<Lesson, 'completed'>) => ({
                ...lesson,
                completed: false
            }))
        }));

    } catch (error) {
        console.error(`Error generating course outline for "${courseTitle}":`, error);
        throw new Error("Failed to generate course outline.");
    }
};

export const generateLessonContent = async (courseTitle: string, lessonTitle: string, isAssessment: boolean): Promise<string> => {
     try {
        const contentPrompt = `
            You are a world-class instructional designer creating a "ZERO to HERO" lesson plan for the lesson "${lessonTitle}" in the course "${courseTitle}".
            Your output MUST be a single, clean JSON object. Do not include any markdown formatting or explanations outside the JSON structure.

            **JSON Schema Guidelines:**
            The root object must have three keys: "lessonTitle", "dailyPlans", and "summaryHTML".
            1.  "lessonTitle": A string containing the lesson title.
            2.  "dailyPlans": An array of 5 objects, one for each day.
            3.  "summaryHTML": A single HTML string for the final lesson summary.

            **Daily Plan Object Schema (for each object in the "dailyPlans" array):**
            Each object must have four keys: "day", "title", "contentHTML", and "quiz".
            1.  "day": An integer (1-5).
            2.  "title": A descriptive string for the day's topic.
            3.  "contentHTML": A detailed HTML string for the day's content. This is the "ZERO to HERO" part. It must be in-depth, with clear explanations, practical examples, and formatted beautifully using the HTML rules below.
            4.  "quiz": An array of 2-3 quiz question objects.

            **Quiz Question Object Schema (for each object in the "quiz" array):**
            Each object must have three keys: "question", "options", and "answer".
            1.  "question": A string with the question text.
            2.  "options": An array of 4 unique strings representing the choices.
            3.  "answer": A string that EXACTLY matches one of the strings in the "options" array.

            **HTML Formatting Rules (for "contentHTML" and "summaryHTML"):**
            -   **Structure & Readability**: Use short paragraphs (<p class="text-gray-300 leading-relaxed mb-4">). Use headings for sub-topics (<h4 class="text-lg font-semibold text-white mt-6 mb-2">).
            -   **Emphasis**: Use <strong> and <u> for key terms.
            -   **Code Blocks**: Use <pre class="bg-gray-900 text-sm text-white rounded-md p-4 overflow-x-auto my-4"><code class="...">...</code></pre> for multi-line code and <code class="bg-gray-700 text-cyan-300 px-1 py-0.5 rounded text-sm">...</code> for inline code.
            -   **Lists**: Use <ul class="list-disc list-inside text-gray-300 space-y-2 pl-4 mb-4"> and <ol class="list-decimal list-inside text-gray-300 space-y-2 pl-4 mb-4">.
            -   **Key Concepts**: Use this specific structure for important callouts:
                <div class="p-4 bg-gray-700/60 border border-gray-600 rounded-lg my-4">
                    <h4 class="font-bold text-cyan-300">🧠 Key Concept: [Concept Name]</h4>
                    <p class="mt-2 text-gray-300">[Detailed explanation.]</p>
                </div>
            -   **Tone**: Be encouraging, mentor-like, and use emojis (🚀, 💡, ✅, 🧠).
        `;

        const assessmentPrompt = `
            You are an expert educator on the E-Learnify platform. Your task is to generate an assessment for a lesson within the "${courseTitle}" course.
            The assessment is titled: "${lessonTitle}".
            The output MUST be a single, clean HTML snippet. DO NOT include <html>, <head>, or <body> tags.

            Guidelines:
            - Create a multiple-choice quiz with 5-7 questions that thoroughly test the lesson's concepts.
            - Each question should have 4 options, with one correct answer.
            - Format the output using clean HTML. The entire quiz should be wrapped in a styled container: <div class="p-6 bg-gray-800 border border-gray-700 rounded-lg">
            - Inside the container, use a <form> tag. Each question should be in a <div class="my-6"> with a <p class="font-semibold text-lg mb-2"> for the question text.
            - Options should be a <ul> of <li> items, each containing a <label> with an <input type="radio">.
            - Indicate the correct answers clearly in a simple paragraph at the very end, outside the form but inside the main container, like "<p class="mt-6 pt-4 border-t border-gray-600 text-sm text-gray-400">Correct Answers: 1-C, 2-A, ...</p>".
        `;

        const prompt = isAssessment ? assessmentPrompt : contentPrompt;
        
        if (isAssessment) {
             const response = await ai.models.generateContent({ model, contents: prompt });
             return response.text;
        }

        // For structured content, use the JSON schema
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        lessonTitle: { type: Type.STRING },
                        summaryHTML: { type: Type.STRING },
                        dailyPlans: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    day: { type: Type.NUMBER },
                                    title: { type: Type.STRING },
                                    contentHTML: { type: Type.STRING },
                                    quiz: {
                                        type: Type.ARRAY,
                                        items: {
                                            type: Type.OBJECT,
                                            properties: {
                                                question: { type: Type.STRING },
                                                answer: { type: Type.STRING },
                                                options: { type: Type.ARRAY, items: { type: Type.STRING } }
                                            },
                                            required: ["question", "answer", "options"]
                                        }
                                    }
                                },
                                required: ["day", "title", "contentHTML", "quiz"]
                            }
                        }
                    },
                    required: ["lessonTitle", "summaryHTML", "dailyPlans"]
                }
            }
        });

        return response.text;

    } catch (error) {
        console.error(`Error generating content for lesson "${lessonTitle}":`, error);
        return `{"error": "Sorry, there was an error generating the content for this lesson. Please try again."}`;
    }
};
