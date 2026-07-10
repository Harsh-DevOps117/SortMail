import * as stopword from 'stopword';
import natural from 'natural';
import { convert } from 'html-to-text';

export const optimizeEmailForLLM = (htmlBody: string): string => {
  const rawText = convert(htmlBody, {
    wordwrap: false,
    selectors: [
      { selector: 'a', options: { ignoreHref: true } },
      { selector: 'img', format: 'skip' }
    ]
  });

  const tokenizer = new natural.WordTokenizer();
  const tokens = tokenizer.tokenize(rawText.toLowerCase()) || [];

  const meaningfulWords = stopword.removeStopwords(tokens);

  const stemmer = natural.PorterStemmer;
  const stemmedWords = meaningfulWords.map(word => stemmer.stem(word));

  return stemmedWords.join(' ');
};

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
