// src/ai/flows/translate-subtitles.ts
'use server';

/**
 * @fileOverview Translates English subtitles to German.
 *
 * - translateSubtitles - A function that translates English subtitles to German.
 * - TranslateSubtitlesInput - The input type for the translateSubtitles function.
 * - TranslateSubtitlesOutput - The return type for the translateSubtitles function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateSubtitlesInputSchema = z.object({
  englishSubtitles: z
    .string()
    .describe('The English subtitles to translate to German.'),
});
export type TranslateSubtitlesInput = z.infer<typeof TranslateSubtitlesInputSchema>;

const TranslateSubtitlesOutputSchema = z.object({
  germanSubtitles: z.string().describe('The translated German subtitles.'),
});
export type TranslateSubtitlesOutput = z.infer<typeof TranslateSubtitlesOutputSchema>;

export async function translateSubtitles(
  input: TranslateSubtitlesInput
): Promise<TranslateSubtitlesOutput> {
  return translateSubtitlesFlow(input);
}

const translateSubtitlesPrompt = ai.definePrompt({
  name: 'translateSubtitlesPrompt',
  input: {schema: TranslateSubtitlesInputSchema},
  output: {schema: TranslateSubtitlesOutputSchema},
  prompt: `Translate the following English subtitles to German:\n\n{{englishSubtitles}}`,
});

const translateSubtitlesFlow = ai.defineFlow(
  {
    name: 'translateSubtitlesFlow',
    inputSchema: TranslateSubtitlesInputSchema,
    outputSchema: TranslateSubtitlesOutputSchema,
  },
  async input => {
    const {output} = await translateSubtitlesPrompt(input);
    return output!;
  }
);
