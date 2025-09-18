import { GoogleGenAI, Type } from "@google/genai";
import { ParsedCommand, Priority, Category, TaskStatus, Task } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export async function parseCommand(command: string, tasks: Task[]): Promise<ParsedCommand | null> {
    const taskTitles = tasks.map(t => `- "${t.title}"`).join('\n');

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Parse the following user command for a to-do list application.
            Infer the category if not explicitly mentioned. Extract the action (add, delete, complete, move), task details, or target task.
            When deleting, completing, or moving a task, you MUST identify the correct task from the provided list and return its exact title.
            
            Existing Tasks:
            ${taskTitles.length > 0 ? taskTitles : "No tasks yet."}

            Command: "${command}"
            
            Today is ${new Date().toDateString()}.
            Return ONLY the JSON object.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        action: {
                            type: Type.STRING,
                            enum: ['add', 'delete', 'complete', 'move'],
                            description: 'The action to perform.',
                        },
                        task: {
                            type: Type.OBJECT,
                            description: 'Details for a new task. Only for "add" action.',
                            properties: {
                                title: { type: Type.STRING, description: 'The title of the task.' },
                                priority: { type: Type.STRING, enum: Object.values(Priority), description: 'The priority level.' },
                                category: { type: Type.STRING, enum: Object.values(Category), description: 'The category of the task. Infer this if not specified.' },
                                dueDate: { type: Type.STRING, description: 'The due date in YYYY-MM-DD format. Infer from "tomorrow", "next Friday", etc.' },
                            }
                        },
                        targetTaskTitle: {
                            type: Type.STRING,
                            description: "The exact title of the task to delete, complete, or move, identified from the 'Existing Tasks' list."
                        },
                        targetStatus: {
                            type: Type.STRING,
                            enum: ['Todo', 'InProgress', 'Done'],
                            description: 'The target status column for the "move" action.'
                        }
                    },
                },
            },
        });

        // FIX: Replaced complex and incorrect response parsing with the direct `response.text` property.
        const jsonString = response.text.trim();
        const parsedJson = JSON.parse(jsonString);
        return parsedJson as ParsedCommand;

    } catch (error) {
        console.error("Error parsing command with Gemini:", error);
        return null;
    }
}
