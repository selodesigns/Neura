import { openai, MODEL } from '../config/openai.js';

/**
 * AI Research Agent - Orchestrates multi-perspective research queries
 */
class AIResearchAgent {
  constructor() {
    this.perspectives = [
      'analytical',
      'creative',
      'critical',
      'historical',
      'practical',
      'theoretical',
    ];
  }

  /**
   * Generate diverse question formulations from a base query
   */
  async generateQuestionVariations(baseQuery) {
    const prompt = `Given this research query: "${baseQuery}"

Generate 3 alternative formulations that explore different angles:
1. A more specific, detailed version
2. A broader, conceptual version
3. A practical, application-focused version

Return only the questions, one per line.`;

    try {
      const response = await openai.chat.completions.create({
        model: MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
        max_tokens: 300,
      });

      const variations = response.choices[0].message.content
        .split('\n')
        .filter(line => line.trim())
        .map(line => line.replace(/^\d+\.\s*/, '').trim());

      return [baseQuery, ...variations];
    } catch (error) {
      console.error('Error generating question variations:', error);
      return [baseQuery];
    }
  }

  /**
   * Get AI response from a specific perspective
   */
  async getResponseFromPerspective(query, perspective) {
    const perspectivePrompts = {
      analytical: 'Analyze this from a data-driven, logical perspective. Break down the components systematically.',
      creative: 'Explore this from a creative, innovative angle. Think outside conventional boundaries.',
      critical: 'Critically evaluate this. What are the limitations, biases, or potential issues?',
      historical: 'Examine this through a historical lens. How has this evolved over time?',
      practical: 'Focus on practical applications and real-world implications.',
      theoretical: 'Explore the theoretical foundations and underlying principles.',
    };

    const systemPrompt = `You are an expert researcher. ${perspectivePrompts[perspective]} Provide insightful, well-researched information.`;

    try {
      const response = await openai.chat.completions.create({
        model: MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: query },
        ],
        temperature: 0.7,
        max_tokens: 800,
      });

      return {
        perspective,
        content: response.choices[0].message.content,
        tokens: response.usage.total_tokens,
      };
    } catch (error) {
      console.error(`Error getting ${perspective} response:`, error);
      return {
        perspective,
        content: `Error: Unable to generate ${perspective} perspective.`,
        error: true,
      };
    }
  }

  /**
   * Conduct multi-perspective research on a query
   */
  async conductResearch(query, selectedPerspectives = null) {
    const perspectives = selectedPerspectives || this.perspectives.slice(0, 3);
    const questionVariations = await this.generateQuestionVariations(query);

    // Get responses from multiple perspectives in parallel
    const responses = await Promise.all(
      perspectives.map(perspective =>
        this.getResponseFromPerspective(questionVariations[0], perspective)
      )
    );

    return {
      originalQuery: query,
      questionVariations,
      responses,
      perspectives: perspectives,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Synthesize multiple perspectives into a coherent summary
   */
  async synthesizeResponses(responses) {
    const combinedContent = responses
      .map(r => `**${r.perspective.toUpperCase()} PERSPECTIVE:**\n${r.content}`)
      .join('\n\n---\n\n');

    const synthesisPrompt = `Given these different perspectives on a research topic:

${combinedContent}

Create a comprehensive synthesis that:
1. Identifies common themes and patterns
2. Highlights complementary insights
3. Notes any contradictions or tensions
4. Provides a balanced, integrated understanding

Keep it concise but thorough (max 400 words).`;

    try {
      const response = await openai.chat.completions.create({
        model: MODEL,
        messages: [{ role: 'user', content: synthesisPrompt }],
        temperature: 0.6,
        max_tokens: 600,
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error synthesizing responses:', error);
      return 'Error generating synthesis.';
    }
  }

  /**
   * Generate inline suggestions for markdown content
   */
  async generateInlineSuggestions(context, cursorPosition) {
    const prompt = `Given this markdown context:
${context}

The user is at position: "${cursorPosition}"

Suggest 3 brief, relevant continuations or improvements (each max 50 words).`;

    try {
      const response = await openai.chat.completions.create({
        model: MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 300,
      });

      return response.choices[0].message.content.split('\n').filter(s => s.trim());
    } catch (error) {
      console.error('Error generating suggestions:', error);
      return [];
    }
  }

  /**
   * Expand a section of text with more detail
   */
  async expandSection(text, direction = 'elaborate') {
    const prompts = {
      elaborate: `Elaborate on this text with more detail and examples:\n\n${text}`,
      simplify: `Simplify this text while preserving key information:\n\n${text}`,
      rephrase: `Rephrase this text for better clarity:\n\n${text}`,
    };

    try {
      const response = await openai.chat.completions.create({
        model: MODEL,
        messages: [{ role: 'user', content: prompts[direction] }],
        temperature: 0.7,
        max_tokens: 500,
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error expanding section:', error);
      return text;
    }
  }
}

export default new AIResearchAgent();
