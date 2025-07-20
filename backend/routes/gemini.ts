import { Router } from 'express';
import { GoogleGenAI, Type } from '@google/genai';

const router = Router();

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

router.post('/generate-product-description', async (req, res) => {
    const { name, category } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Product name is required.' });
    }
    try {
        const prompt = `Generate a compelling and SEO-friendly product description for a product named \"${name}\" in the category \"${category}\". The description should be about 100-150 words long and highlight its key features and benefits for customers. The tone should be enthusiastic and professional.`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        res.json({ text: response.text });
    } catch (error) {
        console.error('AI description generation failed:', error);
        res.status(500).json({ error: 'Failed to generate description.' });
    }
});

router.post('/generate-blog-content', async (req, res) => {
    const { title, tags } = req.body;
    if (!title) {
        return res.status(400).json({ error: 'Blog title is required.' });
    }
    try {
        const prompt = `Write a blog post with the title \"${title}\" and related to the tags \"${tags.join(', ')}\". The post should be engaging, well-structured, and around 300-400 words. Use markdown for formatting, such as **bold headings** for different sections. Start with a captivating introduction, develop the main points in the body, and end with a summary or conclusion.`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        const fullContent = response.text;
        if (!fullContent) {
            return res.status(500).json({ error: 'Failed to generate content: empty response from AI.' });
        }
        const excerpt = fullContent.split('\n\n')[0];
        res.json({ content: fullContent, excerpt });
    } catch (error) {
        console.error('AI content generation failed:', error);
        res.status(500).json({ error: 'Failed to generate content.' });
    }
});

router.post('/generate-job-content', async (req, res) => {
    const { title, department } = req.body;
    if (!title || !department) {
        return res.status(400).json({ error: 'Job title and department are required.' });
    }
    try {
        const prompt = `Based on the job title \"${title}\" in the \"${department}\" department, generate a job description, a list of responsibilities, and a list of qualifications.`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        description: { type: Type.STRING },
                        responsibilities: { type: Type.ARRAY, items: { type: Type.STRING } },
                        qualifications: { type: Type.ARRAY, items: { type: Type.STRING } },
                    }
                }
            }
        });
        const text = response.text;
        if (!text) {
            return res.status(500).json({ error: 'Failed to generate job content: empty response from AI.' });
        }
        res.json(JSON.parse(text));
    } catch (error) {
        console.error('AI job content generation failed:', error);
        res.status(500).json({ error: 'Failed to generate job content.' });
    }
});

router.post('/generate-software-content', async (req, res) => {
    const { name, category } = req.body;
    if (!name || !category) {
        return res.status(400).json({ error: 'Software name and category are required.' });
    }
    try {
        const prompt = `For a software product named \"${name}\" in the \"${category}\" category, generate a product description and a list of key features.`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        description: {
                            type: Type.STRING,
                            description: 'A compelling product description, about 50-70 words long.'
                        },
                        features: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: 'A list of 3-5 key features of the software.'
                        },
                    }
                }
            }
        });
        const text = response.text;
        if (!text) {
            return res.status(500).json({ error: 'Failed to generate software content: empty response from AI.' });
        }
        res.json(JSON.parse(text));
    } catch (error) {
        console.error('AI software content generation failed:', error);
        res.status(500).json({ error: 'Failed to generate software content.' });
    }
});

export default router;