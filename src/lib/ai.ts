import { supabase } from './supabase';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

interface AIResponse {
  success: boolean;
  content?: string;
  error?: string;
}

export async function generateBlogIdeas(topic: string): Promise<AIResponse> {
  const apiKey = await getGroqApiKey();
  if (!apiKey) {
    return {
      success: false,
      error: 'API key not found. Please add your Groq API key in settings.'
    };
  }

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: [{
          role: 'user',
          content: `Generate 5 blog post ideas about ${topic}. Format as a JSON array of objects with 'title' and 'outline' properties.`
        }],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error('AI API request failed');
    }

    const data = await response.json();
    return {
      success: true,
      content: data.choices[0].message.content
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate blog ideas'
    };
  }
}

export async function enhanceBlogContent(content: string, instructions: string): Promise<AIResponse> {
  const apiKey = await getGroqApiKey();
  if (!apiKey) {
    return {
      success: false,
      error: 'API key not found. Please add your Groq API key in settings.'
    };
  }

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: [{
          role: 'user',
          content: `Enhance this blog content according to these instructions: "${instructions}"\n\nContent to enhance:\n${content}`
        }],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error('AI API request failed');
    }

    const data = await response.json();
    return {
      success: true,
      content: data.choices[0].message.content
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to enhance content'
    };
  }
}

export async function generateBlogPost(title: string, description: string): Promise<AIResponse> {
  const apiKey = await getGroqApiKey();
  if (!apiKey) {
    return {
      success: false,
      error: 'API key not found. Please add your Groq API key in settings.'
    };
  }

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: [{
          role: 'user',
          content: `Write a comprehensive blog post with the title "${title}" based on this description: "${description}". Include:
            - An engaging introduction
            - 3-4 main sections with appropriate headings
            - Relevant examples and explanations
            - A conclusion that summarizes key points
            
            Format the content with proper HTML tags:
            - Use <h1> for the main title
            - Use <h2> for main section headings
            - Use <h3> for subsection headings
            - Use <p> for paragraphs
            - Use <ul> and <li> for lists
            - Use <strong> for emphasis
            - Use <em> for italics
            
            Make sure the content flows naturally and maintains a consistent tone throughout.`
        }],
        temperature: 0.7,
        max_tokens: 3000
      })
    });

    if (!response.ok) {
      throw new Error('AI API request failed');
    }

    const data = await response.json();
    return {
      success: true,
      content: data.choices[0].message.content
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate blog post'
    };
  }
}

async function getGroqApiKey(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user.id) return null;

  const { data, error } = await supabase
    .from('user_profiles')
    .select('groq_api_key')
    .eq('user_id', session.user.id)
    .single();

  if (error || !data?.groq_api_key) return null;
  return data.groq_api_key;
}