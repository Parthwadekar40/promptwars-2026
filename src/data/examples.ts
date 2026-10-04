import type { Analysis } from '../lib/analyze';

/** Starter decisions — and the first one doubles as the instant sample (and the offline fallback). */
export const EXAMPLES = [
  {
    label: 'A job offer in another city',
    decision:
      "I've been offered a product role in Bengaluru with a 40% higher salary. My parents and closest friends are in Pune, and my current job is stable but I've stopped learning much. I have to answer by Friday.",
    leaning: 'Leaning toward taking it — the raise is hard to ignore and I keep thinking about the title.',
  },
  {
    label: 'Ship Friday or delay',
    decision:
      'We planned to ship our new feature this Friday. QA found a few non-critical bugs and a performance issue on older phones. The team could delay two weeks, but marketing has already announced the date.',
    leaning: 'Ship on Friday — we announced it, and delaying makes us look unreliable.',
  },
  {
    label: 'Lending money to a friend',
    decision:
      "A close friend asked to borrow ₹1.5 lakh for his business. I can afford it, but it's most of my emergency fund. He helped me when I needed it.",
    leaning: 'I want to say yes — he was there for me, and saying no feels disloyal.',
  },
] as const;

export const SAMPLE: Analysis = {
  title: 'Bengaluru offer vs. Pune',
  heard:
    "You're deciding whether to move to Bengaluru for a higher-paying product role or stay in Pune, where your family, friends and a stable job are.",
  noticedFirst:
    'The 40% raise and the title — the first things you mention, and the reasons you give for leaning toward the move.',
  outside:
    'Almost nothing here describes what daily work in the new role would be like — or what staying could become if you asked for change.',
  assumptions: [
    {
      text: 'The 40% raise will feel like a 40% raise.',
      hint: 'Compare rent, commute and living costs line by line; work out your real monthly surplus in each city.',
    },
    {
      text: 'The new role will be the learning you are missing.',
      hint: 'Ask to speak with two people on the team about what they learned in their first year.',
    },
    {
      text: "Your current job can't change — so leaving is the only fix.",
      hint: 'Have one honest conversation with your manager about scope before Friday.',
    },
    {
      text: 'Distance from family is something you can adjust to later.',
      hint: 'Picture a typical month: how often would you actually be home, and what would be missed?',
    },
  ],
  risks: [
    {
      text: 'Offer details harden after you accept — scope, reporting line, bonus structure.',
      hint: 'Vague answers to concrete questions about your first 90 days.',
    },
    {
      text: 'Starting over socially eats into the gain.',
      hint: 'You cannot name three people you would see weekly in your first month.',
    },
    {
      text: "The new company's stability is unknown.",
      hint: 'Little public information on funding, attrition or leadership turnover.',
    },
  ],
  missing: [
    {
      text: "Your parents' view — and what they may need from you in the next 3–5 years.",
      hint: 'Family needs change slowly, then suddenly; you have not said how they feel.',
    },
    {
      text: 'Your own definition of "growth".',
      hint: 'Title, skills, income and autonomy pull in different directions; the offer may serve one and cost another.',
    },
    {
      text: 'How reversible each path is.',
      hint: 'Moving back is possible but costs time and money; leaving a stable job may be harder to undo than it looks.',
    },
    {
      text: 'Whether the Friday deadline is real.',
      hint: 'Deadlines are often negotiable, and urgency narrows what we notice.',
    },
  ],
  traps: [
    { text: 'Anchoring', hint: 'The raise figure may be shaping how you read everything else about the offer.' },
    { text: 'Deadline pressure', hint: 'Friday may be making a negotiable choice feel urgent.' },
  ],
  otherSide:
    "Staying in Pune isn't only comfort. It keeps your support network, your savings rate may be nearly identical once costs are counted, and the offer itself could be leverage to reshape your current role. A year of deliberately building new skills where you already have stability can be a fast route to growth, with a smaller downside.",
  questions: [
    'If the salary were identical, would you still want this job? What does your answer tell you?',
    'What exactly have you stopped learning at your current job — and have you asked for it?',
    'A year from now, which regret would be harder to live with: having moved, or having stayed? Why?',
    "Who haven't you talked to yet — your parents, someone on the new team, someone who made a similar move?",
    'What would you need to see by Friday to feel settled either way — and can you ask for it?',
  ],
  care: '',
};
