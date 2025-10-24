import OpenAI from 'openai';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

/**
 * LLM Provider Configuration
 * Supports both OpenAI and Ollama (local LLMs)
 */

const LLM_PROVIDER = process.env.LLM_PROVIDER || 'openai'; // 'openai' or 'ollama'
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4-turbo-preview';
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama2';

// Initialize OpenAI client (if using OpenAI)
let openaiClient = null;
if (LLM_PROVIDER === 'openai' && OPENAI_API_KEY) {
  openaiClient = new OpenAI({
    apiKey: OPENAI_API_KEY,
  });
}

/**
 * Unified LLM Provider Interface
 * Abstracts OpenAI and Ollama to provide consistent API
 */
class LLMProvider {
  constructor() {
    this.provider = LLM_PROVIDER;
    this.model = LLM_PROVIDER === 'openai' ? OPENAI_MODEL : OLLAMA_MODEL;
  }

  /**
   * Generate chat completion
   * @param {Array} messages - Array of message objects with role and content
   * @param {Object} options - Additional options (temperature, max_tokens, etc.)
   * @returns {Promise<Object>} Response with content and usage info
   */
  async chat(messages, options = {}) {
    const { temperature = 0.7, max_tokens = 800 } = options;

    if (this.provider === 'openai') {
      return this._chatOpenAI(messages, { temperature, max_tokens });
    } else if (this.provider === 'ollama') {
      return this._chatOllama(messages, { temperature, max_tokens });
    } else {
      throw new Error(`Unsupported LLM provider: ${this.provider}`);
    }
  }

  /**
   * OpenAI chat completion
   */
  async _chatOpenAI(messages, options) {
    if (!openaiClient) {
      throw new Error('OpenAI client not initialized. Check OPENAI_API_KEY.');
    }

    try {
      const response = await openaiClient.chat.completions.create({
        model: this.model,
        messages,
        temperature: options.temperature,
        max_tokens: options.max_tokens,
      });

      return {
        content: response.choices[0].message.content,
        tokens: response.usage?.total_tokens || 0,
        model: this.model,
        provider: 'openai',
      };
    } catch (error) {
      console.error('OpenAI API error:', error.message);
      throw error;
    }
  }

  /**
   * Ollama chat completion
   */
  async _chatOllama(messages, options) {
    try {
      // Convert messages to Ollama format
      const prompt = this._formatMessagesForOllama(messages);

      const response = await axios.post(`${OLLAMA_BASE_URL}/api/generate`, {
        model: this.model,
        prompt,
        stream: false,
        options: {
          temperature: options.temperature,
          num_predict: options.max_tokens,
        },
      });

      return {
        content: response.data.response,
        tokens: response.data.eval_count || 0,
        model: this.model,
        provider: 'ollama',
      };
    } catch (error) {
      console.error('Ollama API error:', error.message);
      if (error.code === 'ECONNREFUSED') {
        throw new Error(
          'Cannot connect to Ollama. Make sure Ollama is running at ' + OLLAMA_BASE_URL
        );
      }
      throw error;
    }
  }

  /**
   * Format OpenAI-style messages for Ollama
   */
  _formatMessagesForOllama(messages) {
    return messages
      .map(msg => {
        if (msg.role === 'system') {
          return `System: ${msg.content}\n`;
        } else if (msg.role === 'user') {
          return `User: ${msg.content}\n`;
        } else if (msg.role === 'assistant') {
          return `Assistant: ${msg.content}\n`;
        }
        return '';
      })
      .join('\n');
  }

  /**
   * Check if LLM provider is available
   */
  async checkHealth() {
    try {
      if (this.provider === 'openai') {
        if (!openaiClient) {
          return { available: false, error: 'OpenAI API key not configured' };
        }
        return { available: true, provider: 'openai', model: this.model };
      } else if (this.provider === 'ollama') {
        const response = await axios.get(`${OLLAMA_BASE_URL}/api/tags`);
        const models = response.data.models || [];
        const modelExists = models.some(m => m.name === this.model);
        
        if (!modelExists) {
          return {
            available: false,
            error: `Model '${this.model}' not found. Available models: ${models.map(m => m.name).join(', ')}`,
          };
        }
        
        return {
          available: true,
          provider: 'ollama',
          model: this.model,
          baseUrl: OLLAMA_BASE_URL,
        };
      }
    } catch (error) {
      return {
        available: false,
        error: error.message,
      };
    }
  }

  /**
   * Get provider info
   */
  getInfo() {
    return {
      provider: this.provider,
      model: this.model,
      baseUrl: this.provider === 'ollama' ? OLLAMA_BASE_URL : undefined,
    };
  }
}

// Export singleton instance
export const llmProvider = new LLMProvider();

// Export for backward compatibility
export const openai = openaiClient;
export const MODEL = LLM_PROVIDER === 'openai' ? OPENAI_MODEL : OLLAMA_MODEL;
