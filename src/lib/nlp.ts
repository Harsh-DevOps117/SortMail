import * as stopword from 'stopword';
import natural from 'natural';
import { convert } from 'html-to-text';

/**
 * Optimizes an email body by removing HTML, tokenizing, removing stopwords, 
 * and stemming the remaining words.
 * 
 * @param htmlBody The raw HTML email body from Gmail
 * @returns A dense, highly optimized string of keywords for the LLM
 */
export const optimizeEmailForLLM = (htmlBody: string): string => {
  // 1. Strip all HTML tags to get pure text
  const rawText = convert(htmlBody, {
    wordwrap: false,
    selectors: [
      { selector: 'a', options: { ignoreHref: true } },
      { selector: 'img', format: 'skip' }
    ]
  });

  // 2. Tokenize: Convert string into array of lowercase words (removing punctuation)
  const tokenizer = new natural.WordTokenizer();
  const tokens = tokenizer.tokenize(rawText.toLowerCase()) || [];

  // 3. Remove Stopwords ("a", "the", "is", "for")
  const meaningfulWords = stopword.removeStopwords(tokens);

  // 4. Apply Stemming (e.g., "running" -> "run", "internships" -> "internship")
  const stemmer = natural.PorterStemmer;
  const stemmedWords = meaningfulWords.map(word => stemmer.stem(word));

  // 5. Rejoin into a dense string
  return stemmedWords.join(' ');
};

// Example Usage (You can delete this later):
if (require.main === module) {
  const sampleEmail = `
    <html>
      <body>
        <p>Hi Harsh,</p>
        <p>The recruiter is actively reviewing your application for the Software Engineering internship.</p>
        <p>Are you available for a phone screening on Tuesday?</p>
        <p>Let me know what you think!</p>
      </body>
    </html>
  `;
  
  console.log("Original Length:", sampleEmail.length);
  const optimized = optimizeEmailForLLM(sampleEmail);
  console.log("Optimized Result:", optimized);
  console.log("Optimized Length:", optimized.length);
}
