import type { Analysis } from '../lib/analyze';

/**
 * Starter decisions. The first is the scenario from the challenge brief itself (a student weighing a
 * 6-month internship for the stipend, proximity and "industry experience") — it doubles as the instant
 * sample and as the graceful fallback when the AI is rate-limited.
 */
export const EXAMPLES = [
  {
    label: 'A 6-month internship',
    decision:
      "I've been offered a 6-month analyst internship at a company 15 minutes from my home. The stipend is ₹25,000 a month and it's 40 hours a week, weekdays. My classes run until 3 pm, and my end-semester exams in December fall in the middle of the internship. They promised \"exposure to real projects\" but haven't said who would mentor me.",
    leaning: 'Mainly because the stipend is good, the company is close to home, and it will give me industry experience.',
  },
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
  title: '6-month internship',
  heard:
    "You're deciding whether to accept a 6-month analyst internship near home — good stipend, full-time hours — while classes run until 3 pm and your December exams fall in the middle of it.",
  noticedFirst:
    'The stipend, the short commute and the promise of "industry experience" — the three reasons you give for saying yes.',
  outside:
    'Almost nothing here is about what you would actually learn, who would teach you, or how the internship fits around your semester.',
  assumptions: [
    {
      text: '"Industry experience" will automatically mean real learning.',
      hint: 'Ask for the project list and a sample week; talk to a former intern about what they actually did.',
    },
    {
      text: 'A good stipend makes the trade worth it.',
      hint: 'Work out the stipend per hour after travel and lost study time, then compare it with a lighter option.',
    },
    {
      text: 'You can carry 40 working hours on top of classes until 3 pm.',
      hint: 'Draw one real week hour by hour — travel, classes, assignments, sleep.',
    },
    {
      text: 'The December exams will somehow work out.',
      hint: 'Ask now, in writing, whether leave or flexible hours are possible during exam weeks.',
    },
  ],
  conflicts: [
    {
      text: "You want industry experience, yet you haven't asked who would mentor you or what the role involves day to day.",
      hint: 'What would make you confident this role teaches skills you cannot get elsewhere?',
    },
    {
      text: '"Close to home" saves commute time, but full-time hours leave little room for the college schedule you described.',
      hint: 'Which matters more this semester — the commute you save or the study time you lose?',
    },
    {
      text: 'The stipend is your first reason, experience your second — they can point to different choices.',
      hint: 'If the stipend were half, would you still want it? If the learning were thin, would the stipend alone be enough?',
    },
  ],
  risks: [
    {
      text: 'Academics slip when internship hours and exam weeks collide.',
      hint: 'You are skipping lectures or missing assignment deadlines within the first month.',
    },
    {
      text: 'The role turns out to be routine tasks with little mentoring.',
      hint: 'By week three you have had no feedback from a senior and own nothing.',
    },
    {
      text: 'Burnout from stacking full-time hours on top of classes.',
      hint: 'Sleep and weekends disappear, and you start to dread both.',
    },
  ],
  missing: [
    {
      text: 'The impact on your academics — grades, attendance rules and exam timing.',
      hint: 'December exams overlap the internship; attendance or credit rules may limit what is possible.',
    },
    {
      text: 'Actual learning and mentorship.',
      hint: 'Experience is only valuable if someone teaches, reviews your work and gives you real responsibility.',
    },
    {
      text: 'Long-term career prospects.',
      hint: 'Could this lead to a pre-placement offer, a strong reference, or skills the next employer asks for?',
    },
    {
      text: 'Other ways to spend the same six months.',
      hint: 'A research project, a lighter part-time role or a project of your own might offer more learning for less strain.',
    },
  ],
  traps: [
    {
      text: 'Convenience bias',
      hint: 'A short commute and a steady payout are vivid and immediate; learning and career effects are distant and easy to underweight.',
    },
    {
      text: 'Social proof',
      hint: 'When everyone seems to collect internships, "experience" can feel mandatory before you have checked its quality.',
    },
  ],
  otherSide:
    "Declining isn't \"missing out\". Six months of full attention on coursework — or on one deep project you choose yourself — can build stronger grades, sharper skills and a better portfolio than a role with unclear mentorship. And internships that fit more closely tend to keep appearing, often after another semester of preparation.",
  questions: [
    'What exactly would you be doing in a typical week — and who would teach you?',
    'How would 40 hours of work fit around classes until 3 pm and the December exams? What would have to give?',
    'If the stipend were half as much, would you still want this internship? What does your answer tell you?',
    "Which skills would you have in six months that you couldn't get from this semester's courses or a project of your own?",
    'Who could you talk to — a former intern, a senior, a faculty member — before you answer?',
  ],
  care: '',
};
