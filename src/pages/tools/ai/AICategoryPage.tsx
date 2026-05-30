import CategoryLandingPage from '../CategoryLandingPage';

const faqs = [
  { q: 'How does the AI text detector work?', a: 'Our AI detector uses deterministic heuristic features to analyze text patterns. It examines sentence length uniformity, vocabulary diversity (Type-Token Ratio), burstiness, and common AI marker phrases to estimate the probability of AI generation.' },
  { q: 'Is the AI detection 100% accurate?', a: 'No, AI detection provides probability estimates, not definitive proofs. Detection accuracy varies with text length (longer is more reliable) and the specific AI model used. Results should be considered indicators for further review, not absolute determinations.' },
  { q: 'What is a token in AI terminology?', a: 'Tokens are the basic units AI models use to process text. Roughly, 1 token equals 4 characters or 3/4 of a word. Our token calculator helps you estimate token counts and API costs for various AI services.' },
  { q: 'How can I optimize my AI prompts?', a: 'Effective prompts are clear, specific, and well-structured. Include context, desired format, and examples when helpful. Our prompt generator can help create effective prompts tailored to your specific use case.' },
  { q: 'What does it mean to "humanize" AI text?', a: 'AI humanization adjusts text to reduce detectable AI patterns like uniform sentence lengths, overused phrases, and formal language. The goal is to make AI-generated content sound more natural and human-written.' },
  { q: 'Can I use AI generators for professional content?', a: 'AI generators can assist with drafts, brainstorming, and formatting, but content should be reviewed and edited by humans. Transparency about AI assistance is increasingly expected, and AI-generated content may require fact-checking.' },
];

export default function AICategoryPage() {
  return (
    <CategoryLandingPage
      intro="Harness the power of AI for content creation, analysis, and optimization. From text detection to prompt generation, image prompting to humanization — our AI tools help you work smarter with artificial intelligence."
      faqs={faqs}
    />
  );
}
