import { isDirective, neutralize, neutralizeReflection } from './guard';
import { SAMPLE } from '../data/examples';

describe('neutrality guard', () => {
  it('flags advice-shaped statements', () => {
    expect(isDirective('You should take the offer.')).toBe(true);
    expect(isDirective('I recommend waiting two weeks.')).toBe(true);
    expect(isDirective('Honestly, the better option is to stay.')).toBe(true);
    expect(isDirective("Don't accept it before Friday.")).toBe(true);
  });

  it('lets questions and observations through — questions are the product', () => {
    expect(isDirective('What would you need to believe for the offer to be right?')).toBe(false);
    expect(isDirective('Do you think you should take it? What makes you say so?')).toBe(false);
    expect(isDirective('The raise may be shaping how you read everything else.')).toBe(false);
  });

  it('removes every directive line from an analysis and counts them', () => {
    const dirty = {
      ...SAMPLE,
      outside: 'You should stay in Pune.',
      questions: [...SAMPLE.questions, 'Take the offer and never look back.'.replace('Take', 'You must take')],
      risks: [{ text: 'Isolation may eat into the gain.', hint: 'I recommend a trial month first.' }, ...SAMPLE.risks],
    };
    const { clean, removed } = neutralize(dirty);
    expect(removed).toBe(3);
    expect(clean.outside).toBe('');
    expect(clean.questions).toEqual(SAMPLE.questions);
    expect(clean.risks).toEqual(SAMPLE.risks);
  });

  it('leaves a clean analysis untouched', () => {
    const { clean, removed } = neutralize(SAMPLE);
    expect(removed).toBe(0);
    expect(clean).toEqual(SAMPLE);
  });

  it('guards reflections too', () => {
    const { clean, removed } = neutralizeReflection({
      shifted: ['You clarified the real pressure is the announcement.'],
      tension: 'You must ship on Friday.',
      stillOpen: ['Who handles the aftermath?'],
      oneQuestion: 'What would settle this for you?',
    });
    expect(removed).toBe(1);
    expect(clean.tension).toBe('');
    expect(clean.oneQuestion).toBe('What would settle this for you?');
  });
});
