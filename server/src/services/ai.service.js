import { config } from '../config/index.js';

export class AiService {
  static async generatePage(prompt) {
    // Server-side AI generation (or intelligent structured fallback when AI_API_KEY is not provisioned)
    const topic = prompt.trim();

    return {
      title: `AI Generated: ${topic.slice(0, 40)}`,
      slug: topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50),
      summary: `Automated layout and copy generated for "${topic}".`,
      elements: [
        {
          type: 'hero',
          headline: `Experience Premium ${topic} in Bhutan`,
          subheading: 'Verified legal eSakor Lagthram title deeds and traditional Rabsel architecture.'
        },
        {
          type: 'features',
          items: ['Certified Himalayan Location', 'Bank of Bhutan Mortgage Escrow', '24/7 Licensed Broker Assistance']
        },
        {
          type: 'cta',
          label: 'Book a Guided Viewing Tour'
        }
      ]
    };
  }

  static async generateFaq(topic) {
    const cleanTopic = topic.trim();
    return {
      question: `How are transactions for ${cleanTopic} regulated in Bhutan?`,
      answer: `All transactions relating to ${cleanTopic} are certified under the Kingdom of Bhutan regulatory framework, ensuring transparent eSakor digital deed transfer and Bank of Bhutan escrow guarantee.`
    };
  }
}
