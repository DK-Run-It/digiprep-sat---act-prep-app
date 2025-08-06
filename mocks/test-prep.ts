import { TestPrepTip, FlashCard } from '@/types';

export const testPrepTips: TestPrepTip[] = [
  // Time Management Tips
  {
    id: 'tip-1',
    title: 'The 30-Second Rule',
    content: 'If you can\'t solve a problem within 30 seconds, mark it and move on. Return to it later if time permits. This prevents you from spending too much time on difficult questions.',
    category: 'time-management',
    examType: 'both',
  },
  {
    id: 'tip-2',
    title: 'Section Time Allocation',
    content: 'For SAT Reading: Spend 13 minutes per passage (65 minutes for 5 passages). For ACT Reading: Spend 8.75 minutes per passage (35 minutes for 4 passages). Always reserve 2-3 minutes at the end to review marked questions.',
    category: 'time-management',
    examType: 'both',
    section: 'SAT_Reading',
  },
  {
    id: 'tip-3',
    title: 'Two-Pass Strategy',
    content: 'On your first pass, answer all questions you find easy. Skip the ones that will take too long. On your second pass, tackle the more difficult questions. This ensures you get all the "easy points" first.',
    category: 'time-management',
    examType: 'both',
  },
  
  // Question Patterns
  {
    id: 'tip-4',
    title: 'SAT Reading Evidence Questions',
    content: 'When you see a question asking "Which choice provides the best evidence for the answer to the previous question?", always answer the previous question first, then look for evidence that supports your answer.',
    category: 'question-patterns',
    examType: 'SAT',
    section: 'SAT_Reading',
  },
  {
    id: 'tip-5',
    title: 'ACT Science Data Interpretation',
    content: 'Most ACT Science questions don\'t require scientific knowledge - they test your ability to interpret graphs, tables, and research summaries. Focus on understanding what the data shows rather than recalling science facts.',
    category: 'question-patterns',
    examType: 'ACT',
    section: 'ACT_Science',
  },
  {
    id: 'tip-6',
    title: 'SAT Writing Concision Questions',
    content: 'When asked to choose the most concise answer, eliminate choices that add unnecessary words or repeat information. The shortest answer that maintains all necessary information is usually correct.',
    category: 'question-patterns',
    examType: 'SAT',
    section: 'SAT_Writing',
  },
  
  // Elimination Strategies
  {
    id: 'tip-7',
    title: 'Extreme Language Detection',
    content: 'Be cautious of answer choices with extreme language like "always," "never," "all," or "none." These absolute terms are often incorrect because they allow for no exceptions.',
    category: 'elimination-strategies',
    examType: 'both',
  },
  {
    id: 'tip-8',
    title: 'Out of Scope Elimination',
    content: 'Eliminate answer choices that introduce new topics not mentioned in the passage. Correct answers typically stay within the scope of what was explicitly discussed.',
    category: 'elimination-strategies',
    examType: 'both',
  },
  {
    id: 'tip-9',
    title: 'Similar Answer Trap',
    content: 'When two answer choices are very similar, usually neither is correct. The test makers include similar options to confuse you - the correct answer is typically distinct.',
    category: 'elimination-strategies',
    examType: 'both',
  },
  
  // Stress Reduction
  {
    id: 'tip-10',
    title: '4-7-8 Breathing Technique',
    content: 'If you feel anxious during the test, try the 4-7-8 breathing technique: Inhale for 4 seconds, hold for 7 seconds, exhale for 8 seconds. Repeat 3-4 times to calm your nervous system.',
    category: 'stress-reduction',
    examType: 'both',
  },
  {
    id: 'tip-11',
    title: 'Progressive Muscle Relaxation',
    content: 'During breaks, try tensing and then relaxing different muscle groups for 5 seconds each. Start with your feet and work up to your shoulders. This releases physical tension that builds during testing.',
    category: 'stress-reduction',
    examType: 'both',
  },
  {
    id: 'tip-12',
    title: 'Positive Self-Talk',
    content: 'Replace negative thoughts ("I can\'t do this") with positive affirmations ("I\'ve prepared for this" or "I can solve this problem"). Your mindset significantly impacts performance.',
    category: 'stress-reduction',
    examType: 'both',
  },
  
  // Math Formulas
  {
    id: 'tip-13',
    title: 'Key Geometry Formulas',
    content: 'Memorize these essential formulas: Area of triangle = (1/2)bh, Area of circle = πr², Volume of cylinder = πr²h, Pythagorean theorem: a² + b² = c², Special right triangles: 30-60-90 and 45-45-90.',
    category: 'math-formulas',
    examType: 'both',
    section: 'SAT_Math_Calc',
  },
  {
    id: 'tip-14',
    title: 'Quadratic Formula',
    content: 'For any quadratic equation ax² + bx + c = 0, the solutions are x = (-b ± √(b² - 4ac)) / 2a. Remember that the discriminant (b² - 4ac) tells you the number of solutions: >0 means two solutions, =0 means one solution, <0 means no real solutions.',
    category: 'math-formulas',
    examType: 'both',
    section: 'SAT_Math_No_Calc',
  },
  {
    id: 'tip-15',
    title: 'Distance, Rate, Time',
    content: 'The formula d = rt (distance = rate × time) is essential for many word problems. Remember that you can rearrange it to find any variable: r = d/t and t = d/r.',
    category: 'math-formulas',
    examType: 'both',
    section: 'SAT_Math_Calc',
  },
  
  // Reading Strategies
  {
    id: 'tip-16',
    title: 'Active Reading Technique',
    content: 'As you read passages, mentally summarize each paragraph in 5-7 words. This improves comprehension and helps you quickly locate information when answering questions.',
    category: 'reading-strategies',
    examType: 'both',
    section: 'SAT_Reading',
  },
  {
    id: 'tip-17',
    title: 'Author\'s Purpose Focus',
    content: 'For questions about the author\'s purpose or main idea, look at the first and last paragraphs. Authors often state their main point at the beginning and reinforce it at the end.',
    category: 'reading-strategies',
    examType: 'both',
    section: 'SAT_Reading',
  },
  {
    id: 'tip-18',
    title: 'Paired Passage Strategy',
    content: 'For paired passages, read and answer questions for Passage 1 first, then Passage 2, and finally the questions that compare both. This prevents confusion between the two passages.',
    category: 'reading-strategies',
    examType: 'SAT',
    section: 'SAT_Reading',
  },
  
  // Grammar Rules
  {
    id: 'tip-19',
    title: 'Subject-Verb Agreement',
    content: 'The subject and verb must agree in number (singular/plural). Watch for prepositional phrases between the subject and verb that might confuse you about which word is the actual subject.',
    category: 'grammar-rules',
    examType: 'both',
    section: 'SAT_Writing',
  },
  {
    id: 'tip-20',
    title: 'Pronoun Consistency',
    content: 'Pronouns must agree with their antecedents in number, gender, and person. Watch for shifts in pronouns (e.g., from "you" to "one") which are usually incorrect.',
    category: 'grammar-rules',
    examType: 'both',
    section: 'SAT_Writing',
  },
  {
    id: 'tip-21',
    title: 'Parallel Structure',
    content: 'Items in a list or series should have the same grammatical form. For example: "She enjoys swimming, hiking, and to read" is incorrect. It should be "She enjoys swimming, hiking, and reading."',
    category: 'grammar-rules',
    examType: 'both',
    section: 'ACT_English',
  },
  
  // Science Strategies (ACT)
  {
    id: 'tip-22',
    title: 'Graph Analysis Shortcut',
    content: 'For ACT Science graphs, first identify the independent variable (x-axis) and dependent variable (y-axis), then look for trends (increasing, decreasing, or constant) before reading questions.',
    category: 'science-strategies',
    examType: 'ACT',
    section: 'ACT_Science',
  },
  {
    id: 'tip-23',
    title: 'Conflicting Viewpoints Strategy',
    content: 'For passages with multiple scientists\' viewpoints, make a quick note of each scientist\'s main claim and one key piece of evidence they use. This makes comparing and contrasting their views much faster.',
    category: 'science-strategies',
    examType: 'ACT',
    section: 'ACT_Science',
  },
  {
    id: 'tip-24',
    title: 'Control Group Identification',
    content: 'In ACT Science experiments, quickly identify the control group or condition (the one without the variable being tested). Many questions ask you to compare results to the control.',
    category: 'science-strategies',
    examType: 'ACT',
    section: 'ACT_Science',
  },
];

export const flashCards: FlashCard[] = [
  // Math Formulas
  {
    id: 'card-1',
    front: 'Quadratic Formula',
    back: 'x = (-b ± √(b² - 4ac)) / 2a\nFor equation: ax² + bx + c = 0',
    category: 'math-formulas',
    examType: 'both',
    section: 'SAT_Math_No_Calc',
  },
  {
    id: 'card-2',
    front: 'Circle Formulas',
    back: 'Area = πr²\nCircumference = 2πr\nArc length = (θ/360) × 2πr\nSector area = (θ/360) × πr²',
    category: 'math-formulas',
    examType: 'both',
    section: 'SAT_Math_Calc',
  },
  {
    id: 'card-3',
    front: 'Special Right Triangles',
    back: '30°-60°-90° triangle: If shortest leg = x\nThen hypotenuse = 2x and longer leg = x√3\n\n45°-45°-90° triangle: If legs = x\nThen hypotenuse = x√2',
    category: 'math-formulas',
    examType: 'both',
    section: 'SAT_Math_No_Calc',
  },
  
  // Grammar Rules
  {
    id: 'card-4',
    front: 'Commonly Confused Words',
    back: 'Their/There/They\'re\nYour/You\'re\nIts/It\'s\nAffect/Effect\nThen/Than\nTo/Too/Two\nWho\'s/Whose',
    category: 'grammar-rules',
    examType: 'both',
    section: 'SAT_Writing',
  },
  {
    id: 'card-5',
    front: 'Comma Rules',
    back: '1. Use commas to separate items in a series\n2. Use a comma before coordinating conjunctions (FANBOYS) connecting independent clauses\n3. Use commas to set off nonessential information\n4. Use commas after introductory elements',
    category: 'grammar-rules',
    examType: 'both',
    section: 'ACT_English',
  },
  {
    id: 'card-6',
    front: 'Pronoun Types',
    back: 'Subject pronouns: I, you, he, she, it, we, they\nObject pronouns: me, you, him, her, it, us, them\nPossessive pronouns: mine, yours, his, hers, its, ours, theirs\nReflexive pronouns: myself, yourself, himself, herself, itself, ourselves, yourselves, themselves',
    category: 'grammar-rules',
    examType: 'both',
    section: 'SAT_Writing',
  },
  
  // Reading Strategies
  {
    id: 'card-7',
    front: 'Types of Evidence',
    back: '1. Facts and statistics\n2. Expert opinions\n3. Examples and anecdotes\n4. Historical references\n5. Analogies and comparisons\n6. Logical reasoning',
    category: 'reading-strategies',
    examType: 'both',
    section: 'SAT_Reading',
  },
  {
    id: 'card-8',
    front: 'Author\'s Tone Words',
    back: 'Positive: enthusiastic, optimistic, hopeful, admiring\nNegative: critical, pessimistic, disapproving, skeptical\nNeutral: objective, analytical, detached, impartial\nOther: ironic, nostalgic, urgent, contemplative',
    category: 'reading-strategies',
    examType: 'both',
    section: 'SAT_Reading',
  },
  {
    id: 'card-9',
    front: 'Rhetorical Devices',
    back: 'Metaphor: implied comparison\nSimile: comparison using "like" or "as"\nPersonification: giving human qualities to non-human things\nHyperbole: extreme exaggeration\nIrony: contrast between expectation and reality\nRhetorical question: question asked for effect',
    category: 'reading-strategies',
    examType: 'both',
    section: 'ACT_Reading',
  },
  
  // Science Strategies
  {
    id: 'card-10',
    front: 'Scientific Method Steps',
    back: '1. Ask a question\n2. Form a hypothesis\n3. Design experiment\n4. Collect data\n5. Analyze results\n6. Draw conclusions\n7. Report findings',
    category: 'science-strategies',
    examType: 'ACT',
    section: 'ACT_Science',
  },
  {
    id: 'card-11',
    front: 'Independent vs. Dependent Variables',
    back: 'Independent variable: What the scientist changes/manipulates\nDependent variable: What the scientist measures as a result\n\nTip: Independent (x-axis) → Dependent (y-axis)',
    category: 'science-strategies',
    examType: 'ACT',
    section: 'ACT_Science',
  },
  {
    id: 'card-12',
    front: 'Control vs. Experimental Groups',
    back: 'Control group: No treatment or standard treatment\nExperimental group: Receives the treatment being tested\n\nPurpose of control: To provide a baseline for comparison',
    category: 'science-strategies',
    examType: 'ACT',
    section: 'ACT_Science',
  },
  
  // Time Management
  {
    id: 'card-13',
    front: 'SAT Section Time Limits',
    back: 'Reading: 65 minutes (52 questions)\nWriting: 35 minutes (44 questions)\nMath No Calculator: 25 minutes (20 questions)\nMath Calculator: 55 minutes (38 questions)',
    category: 'time-management',
    examType: 'SAT',
  },
  {
    id: 'card-14',
    front: 'ACT Section Time Limits',
    back: 'English: 45 minutes (75 questions)\nMath: 60 minutes (60 questions)\nReading: 35 minutes (40 questions)\nScience: 35 minutes (40 questions)\nWriting (optional): 40 minutes (1 essay)',
    category: 'time-management',
    examType: 'ACT',
  },
  {
    id: 'card-15',
    front: 'Pacing Strategy',
    back: 'SAT Reading: ~13 min per passage\nSAT Writing: ~8 min per passage\nSAT Math No Calc: ~1.25 min per question\nSAT Math Calc: ~1.5 min per question\nACT English: ~9 min per passage\nACT Math: 1 min per question\nACT Reading: ~8.75 min per passage\nACT Science: ~5 min per passage',
    category: 'time-management',
    examType: 'both',
  },
];