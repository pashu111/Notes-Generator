import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export const generateGroqResponse = async (prompt) => {
    try {
        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content:
                        "You are an expert educational notes generator. Generate clear, accurate and exam-oriented study notes.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });

        const text = completion.choices?.[0]?.message?.content;

        if (!text) {
            throw new Error("No response received from Groq");
        }

        return text;

    } catch (error) {
        console.error("Groq API Error:", error);
        throw error;
    }
};