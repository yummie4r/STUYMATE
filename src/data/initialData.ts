import { Subject, Note, QuizQuestion, AppTheme } from '../types';

export const APP_THEMES: AppTheme[] = [
  {
    id: 'indigo-violet',
    name: 'Electric Indigo',
    primary: 'from-indigo-600 to-violet-600',
    accent: 'bg-indigo-600 text-white',
    badge: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    bgGlow: 'bg-indigo-500/10'
  },
  {
    id: 'emerald-mint',
    name: 'Emerald Focus',
    primary: 'from-emerald-600 to-teal-600',
    accent: 'bg-emerald-600 text-white',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    bgGlow: 'bg-emerald-500/10'
  },
  {
    id: 'sunset-amber',
    name: 'Sunset Glow',
    primary: 'from-amber-500 to-rose-600',
    accent: 'bg-rose-600 text-white',
    badge: 'bg-amber-100 text-amber-800 border-amber-200',
    bgGlow: 'bg-amber-500/10'
  },
  {
    id: 'ocean-cyan',
    name: 'Ocean Breeze',
    primary: 'from-cyan-600 to-blue-600',
    accent: 'bg-blue-600 text-white',
    badge: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    bgGlow: 'bg-cyan-500/10'
  },
  {
    id: 'berry-purple',
    name: 'Berry Blossom',
    primary: 'from-fuchsia-600 to-pink-600',
    accent: 'bg-pink-600 text-white',
    badge: 'bg-pink-100 text-pink-800 border-pink-200',
    bgGlow: 'bg-pink-500/10'
  }
];

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'math',
    name: 'Mathematics',
    category: 'STEM',
    description: 'Foundations of algebra, geometry, trigonometry, functions, and mathematical modeling.',
    color: '#3B82F6',
    gradient: 'from-blue-500 to-indigo-600',
    bgLight: 'bg-blue-50 text-blue-700',
    borderColor: 'border-blue-200 hover:border-blue-400',
    iconName: 'Calculator',
    topicsCount: 8,
    studyTips: [
      'Work backwards from problem answers to understand logic',
      'Draw diagrams for all geometry and word problems',
      'Memorize fundamental trigonometric identities (sin²θ + cos²θ = 1)'
    ],
    topics: [
      {
        title: 'Quadratic Equations',
        summary: 'Second-degree polynomials of the form ax² + bx + c = 0.',
        keyPoints: [
          'Standard form: ax² + bx + c = 0',
          'Discriminant Δ = b² - 4ac determines nature of roots (Δ > 0: two real, Δ = 0: one real, Δ < 0: complex)',
          'Vertex of parabola: (-b / (2a), f(-b / 2a))'
        ],
        formulaOrExample: 'Quadratic formula: x = (-b ± √(b² - 4ac)) / (2a)'
      },
      {
        title: 'Trigonometric Ratios & Unit Circle',
        summary: 'Relationships between angle measures and side ratios in right triangles.',
        keyPoints: [
          'SOH-CAH-TOA: sin = O/H, cos = A/H, tan = O/A',
          'Pythagorean theorem: a² + b² = c²',
          'Reciprocal ratios: csc = 1/sin, sec = 1/cos, cot = 1/tan'
        ],
        formulaOrExample: 'Pythagorean identity: sin²(x) + cos²(x) = 1'
      },
      {
        title: 'Logarithms & Exponents',
        summary: 'Inverse operations of exponential functions.',
        keyPoints: [
          'Definition: log_b(x) = y ⟺ b^y = x',
          'Product rule: log_b(xy) = log_b(x) + log_b(y)',
          'Quotient rule: log_b(x/y) = log_b(x) - log_b(y)',
          'Power rule: log_b(x^k) = k · log_b(x)'
        ],
        formulaOrExample: 'Change of base formula: log_b(a) = ln(a) / ln(b)'
      }
    ]
  },
  {
    id: 'calculus',
    name: 'Calculus',
    category: 'STEM',
    description: 'Differential and integral calculus, rates of change, accumulation, and series.',
    color: '#8B5CF6',
    gradient: 'from-purple-500 to-violet-700',
    bgLight: 'bg-purple-50 text-purple-700',
    borderColor: 'border-purple-200 hover:border-purple-400',
    iconName: 'FunctionSquare',
    topicsCount: 6,
    studyTips: [
      'Master the Power, Product, and Chain rules first',
      'Remember that differentiation gives slope; integration gives area under curve',
      'Always add the constant of integration (+ C) for indefinite integrals'
    ],
    topics: [
      {
        title: 'Limits & Continuity',
        summary: 'Fundamental concept describing behavior of functions near specific points.',
        keyPoints: [
          'A limit exists if left-hand limit equals right-hand limit: lim(x→c⁻) f(x) = lim(x→c⁺) f(x)',
          'Continuity requires: 1) f(c) exists, 2) lim(x→c) f(x) exists, 3) lim(x→c) f(x) = f(c)',
          'L’Hôpital’s Rule applies to 0/0 and ∞/∞ indeterminate forms'
        ],
        formulaOrExample: "L'Hôpital: lim [f(x)/g(x)] = lim [f'(x)/g'(x)]"
      },
      {
        title: 'Derivatives & Chain Rule',
        summary: 'Instantaneous rates of change and tangent slopes.',
        keyPoints: [
          'Power rule: d/dx [x^n] = n · x^(n-1)',
          'Product rule: (uv)’ = u’v + uv’',
          'Quotient rule: (u/v)’ = (u’v - uv’) / v²',
          'Chain rule: d/dx [f(g(x))] = f’(g(x)) · g’(x)'
        ],
        formulaOrExample: "d/dx [sin(x)] = cos(x),  d/dx [e^x] = e^x,  d/dx [ln(x)] = 1/x"
      },
      {
        title: 'Definite & Indefinite Integrals',
        summary: 'Area calculation, anti-derivatives, and Fundamental Theorem of Calculus.',
        keyPoints: [
          'FTC Part 1: d/dx ∫[a to x] f(t)dt = f(x)',
          'FTC Part 2: ∫[a to b] f(x)dx = F(b) - F(a) where F’(x) = f(x)',
          'Integration by parts: ∫ u dv = uv - ∫ v du'
        ],
        formulaOrExample: 'Power rule: ∫ x^n dx = (x^(n+1))/(n+1) + C  (for n ≠ -1)'
      }
    ]
  },
  {
    id: 'physics',
    name: 'Physics',
    category: 'STEM',
    description: 'Classical mechanics, thermodynamics, electromagnetism, optics, and waves.',
    color: '#0EA5E9',
    gradient: 'from-sky-500 to-cyan-600',
    bgLight: 'bg-sky-50 text-sky-700',
    borderColor: 'border-sky-200 hover:border-sky-400',
    iconName: 'Atom',
    topicsCount: 7,
    studyTips: [
      'Draw free-body diagrams (FBDs) before writing any Newton’s equations',
      'Check units and dimensional analysis at every step',
      'Use conservation of energy (E_initial = E_final) whenever friction is negligible'
    ],
    topics: [
      {
        title: 'Newton’s Laws of Motion & Kinematics',
        summary: 'Principles governing forces, acceleration, mass, and velocity.',
        keyPoints: [
          '1st Law (Inertia): An object remains at rest or constant velocity unless acted on by net external force.',
          '2nd Law: F_net = m · a (Force = mass × acceleration)',
          '3rd Law: Action & Reaction forces are equal in magnitude, opposite in direction.'
        ],
        formulaOrExample: 'Kinematic equation: v² = u² + 2as  and  s = ut + ½at²'
      },
      {
        title: 'Work, Energy & Power',
        summary: 'Kinetic energy, gravitational potential energy, and rate of energy transfer.',
        keyPoints: [
          'Work: W = F · d · cos(θ)',
          'Kinetic Energy: KE = ½mv²',
          'Potential Energy: PE = mgh',
          'Power: P = W / t = F · v'
        ],
        formulaOrExample: 'Conservation: KE_1 + PE_1 = KE_2 + PE_2'
      },
      {
        title: 'Electricity & Ohm’s Law',
        summary: 'Current, voltage, resistance, and electrical circuits.',
        keyPoints: [
          'Ohm’s Law: V = I · R',
          'Electrical Power: P = V · I = I²R = V²/R',
          'Series resistance: R_total = R1 + R2 + ...',
          'Parallel resistance: 1/R_total = 1/R1 + 1/R2 + ...'
        ],
        formulaOrExample: "Ohm's Equation: V (Volts) = I (Amperes) × R (Ohms)"
      }
    ]
  },
  {
    id: 'biology',
    name: 'Biology',
    category: 'Life Sciences',
    description: 'Cellular biology, genetics, human anatomy, physiology, evolution, and ecology.',
    color: '#10B981',
    gradient: 'from-emerald-500 to-green-600',
    bgLight: 'bg-emerald-50 text-emerald-700',
    borderColor: 'border-emerald-200 hover:border-emerald-400',
    iconName: 'Dna',
    topicsCount: 9,
    studyTips: [
      'Use memory mnemonics for stages (e.g. PMAT for mitosis: Prophase, Metaphase, Anaphase, Telophase)',
      'Draw cellular organelle pathways for photosynthesis & cellular respiration',
      'Create Punnett square templates for genetic crosses'
    ],
    topics: [
      {
        title: 'Cell Structure & Organelles',
        summary: 'The basic structural, functional, and biological units of all living organisms.',
        keyPoints: [
          'Mitochondria: "Powerhouse of the cell", site of ATP production via cellular respiration.',
          'Nucleus: Stores genetic material (DNA) and directs cellular activity.',
          'Ribosomes: Site of protein synthesis (translation).',
          'Chloroplast: Site of photosynthesis in plant cells containing chlorophyll.'
        ],
        formulaOrExample: 'Cellular Respiration: C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ~36 ATP'
      },
      {
        title: 'Genetics & DNA Replication',
        summary: 'Heredity, DNA structure, RNA transcription, and protein translation.',
        keyPoints: [
          'DNA double helix structure: Adenine (A) pairs with Thymine (T), Guanine (G) pairs with Cytosine (C).',
          'In RNA, Uracil (U) replaces Thymine (T).',
          'Central Dogma: DNA → (Transcription) → mRNA → (Translation) → Protein.'
        ],
        formulaOrExample: 'Base Pairing: A=T (2 hydrogen bonds), G≡C (3 hydrogen bonds)'
      },
      {
        title: 'Mitosis vs Meiosis',
        summary: 'Mechanisms of cell division for somatic growth vs gamete formation.',
        keyPoints: [
          'Mitosis: 1 diploid cell (2n) produces 2 genetically identical diploid daughter cells (for growth & repair).',
          'Meiosis: 1 diploid cell produces 4 genetically unique haploid gametes (n) (for sexual reproduction).',
          'Crossing over in Prophase I introduces genetic diversity.'
        ],
        formulaOrExample: 'Mitosis phases: Prophase → Metaphase → Anaphase → Telophase'
      }
    ]
  },
  {
    id: 'cs',
    name: 'Computer Studies',
    category: 'Computing',
    description: 'Algorithms, data structures, programming fundamentals, web development, and logic.',
    color: '#6366F1',
    gradient: 'from-indigo-500 to-blue-700',
    bgLight: 'bg-indigo-50 text-indigo-700',
    borderColor: 'border-indigo-200 hover:border-indigo-400',
    iconName: 'Code',
    topicsCount: 8,
    studyTips: [
      'Trace code executions on paper line-by-line with a variable trace table',
      'Understand Big-O time and space complexity for core sorting algorithms',
      'Practice writing small functions daily'
    ],
    topics: [
      {
        title: 'Data Structures & Big-O',
        summary: 'Arrays, Linked Lists, Stacks, Queues, Hash Tables, and Trees.',
        keyPoints: [
          'Array: Fast index access O(1), linear search O(n)',
          'Hash Table: Average O(1) insertion, lookup, and deletion',
          'Stack: LIFO (Last In First Out) - push, pop',
          'Queue: FIFO (First In First Out) - enqueue, dequeue'
        ],
        formulaOrExample: 'Time complexities: O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ)'
      },
      {
        title: 'Core Programming Concepts',
        summary: 'Variables, data types, conditional branching, loops, and functions.',
        keyPoints: [
          'Data Types: Integer, Float, String, Boolean, Array, Object/Dictionary',
          'Loops: for (counted iterations), while (condition-controlled)',
          'Recursion: A function calling itself with a base case to prevent stack overflow.'
        ],
        formulaOrExample: 'Binary Search: Repeatedly halves sorted search space in O(log n) time.'
      },
      {
        title: 'Object-Oriented Programming (OOP)',
        summary: 'The 4 fundamental pillars of OOP design.',
        keyPoints: [
          'Encapsulation: Bundling data and methods into a single unit/class, hiding internal details.',
          'Abstraction: Exposing essential features while hiding implementation complexity.',
          'Inheritance: Subclasses deriving properties and methods from superclasses.',
          'Polymorphism: Objects taking on multiple forms (method overriding & overloading).'
        ],
        formulaOrExample: 'Pillars of OOP: Encapsulation, Abstraction, Inheritance, Polymorphism'
      }
    ]
  },
  {
    id: 'science',
    name: 'Science & Chemistry',
    category: 'STEM',
    description: 'Atomic structure, chemical reactions, periodic table, matter, and earth sciences.',
    color: '#EC4899',
    gradient: 'from-pink-500 to-rose-600',
    bgLight: 'bg-pink-50 text-pink-700',
    borderColor: 'border-pink-200 hover:border-pink-400',
    iconName: 'FlaskConical',
    topicsCount: 7,
    studyTips: [
      'Learn the first 20 elements of the periodic table by heart',
      'Remember OIL RIG: Oxidation Is Loss, Reduction Is Gain of electrons',
      'Balance chemical equations by counting atoms systematically on both sides'
    ],
    topics: [
      {
        title: 'Atomic Structure & Periodic Table',
        summary: 'Protons, neutrons, electrons, electron configuration, and periodic trends.',
        keyPoints: [
          'Atomic Number = Number of protons (identifies the element).',
          'Mass Number = Protons + Neutrons.',
          'Isotopes: Atoms of same element with different neutron counts.',
          'Electronegativity increases across a period (left to right) and decreases down a group.'
        ],
        formulaOrExample: 'Avogadro’s constant: 1 mole = 6.022 × 10²³ particles'
      },
      {
        title: 'Acids, Bases & pH Scale',
        summary: 'Hydronium ions, hydroxide ions, neutralization, and indicators.',
        keyPoints: [
          'pH < 7 is Acidic (high H⁺/H₃O⁺ concentration)',
          'pH = 7 is Neutral (pure water at 25°C)',
          'pH > 7 is Basic/Alkaline (high OH⁻ concentration)',
          'Neutralization reaction: Acid + Base → Salt + Water'
        ],
        formulaOrExample: 'pH definition: pH = -log₁₀[H⁺]'
      },
      {
        title: 'Stoichiometry & Chemical Equations',
        summary: 'Mole calculations, limiting reagents, and percent yields.',
        keyPoints: [
          'Law of Conservation of Mass: Matter cannot be created or destroyed in chemical reactions.',
          'Molar mass = mass of 1 mole of a substance (g/mol).',
          'Number of moles (n) = mass (m) / molar mass (M).'
        ],
        formulaOrExample: 'Ideal Gas Law: PV = nRT'
      }
    ]
  },
  {
    id: 'english',
    name: 'English & Literature',
    category: 'Languages',
    description: 'Grammar mechanics, essay structure, literary devices, rhetoric, and vocabulary.',
    color: '#F59E0B',
    gradient: 'from-amber-500 to-orange-600',
    bgLight: 'bg-amber-50 text-amber-800',
    borderColor: 'border-amber-200 hover:border-amber-400',
    iconName: 'BookOpen',
    topicsCount: 6,
    studyTips: [
      'Use active voice instead of passive voice in essays',
      'Identify rhetorical appeals: Ethos (credibility), Pathos (emotion), Logos (logic)',
      'Cite textual evidence using the PEE method: Point, Evidence, Explanation'
    ],
    topics: [
      {
        title: 'Parts of Speech & Sentence Structure',
        summary: 'Nouns, verbs, adjectives, adverbs, clauses, and sentence coordination.',
        keyPoints: [
          'Independent clause: Expresses complete thought and can stand alone as a sentence.',
          'Dependent clause: Contains subject and verb but cannot stand alone.',
          'FANBOYS coordinating conjunctions: For, And, Nor, But, Or, Yet, So.'
        ],
        formulaOrExample: 'Compound sentence: Independent Clause + Comma + FANBOYS + Independent Clause'
      },
      {
        title: 'Literary Devices & Figurative Language',
        summary: 'Metaphor, simile, personification, hyperbole, irony, and symbolism.',
        keyPoints: [
          'Metaphor: Direct comparison without "like" or "as" (e.g. "Time is a thief").',
          'Simile: Comparison using "like" or "as" (e.g. "Bright as the sun").',
          'Personification: Giving human qualities to non-human entities.',
          'Alliteration: Repetition of initial consonant sounds.'
        ],
        formulaOrExample: 'Irony types: Verbal, Situational, and Dramatic'
      },
      {
        title: 'Essay Architecture & Thesis Statements',
        summary: 'Introduction hooks, clear argumentative thesis, PEEL body paragraphs, and synthesis.',
        keyPoints: [
          'Thesis statement: Clear, defensible central argument placed at the end of the intro.',
          'PEEL method: Point, Evidence, Explanation, Link to thesis.',
          'Conclusion should synthesize main takeaways without mere word-for-word repetition.'
        ],
        formulaOrExample: 'Structure: Hook → Context → Thesis → Arguments with Evidence → Synthesis'
      }
    ]
  },
  {
    id: 'history',
    name: 'History & Social Studies',
    category: 'Humanities',
    description: 'World civilizations, modern history, revolutions, civics, and global treaties.',
    color: '#E11D48',
    gradient: 'from-rose-500 to-red-700',
    bgLight: 'bg-rose-50 text-rose-700',
    borderColor: 'border-rose-200 hover:border-rose-400',
    iconName: 'Landmark',
    topicsCount: 6,
    studyTips: [
      'Create chronological timelines to connect cause-and-effect sequences',
      'Analyze primary sources by considering origin, purpose, and bias',
      'Link historical movements to modern economic and political structures'
    ],
    topics: [
      {
        title: 'The Industrial Revolution',
        summary: 'Transition to new manufacturing processes in Europe and the US (c. 1760-1840).',
        keyPoints: [
          'Invention of the steam engine (James Watt) transformed manufacturing and transportation.',
          'Urbanization: Rapid migration of populations from rural farming to industrial cities.',
          'Rise of factory systems, labor movements, and modern capitalism.'
        ],
        formulaOrExample: 'Key factors: Steam power, mechanization, coal mining, railways'
      },
      {
        title: 'World War I & World War II',
        summary: 'Major global conflicts of the 20th century and subsequent international institutions.',
        keyPoints: [
          'WWI Causes (MAIN): Militarism, Alliances, Imperialism, Nationalism (1914-1918).',
          'Treaty of Versailles (1919) imposed heavy reparations and paved way for future instability.',
          'WWII (1939-1945): Axis vs Allied powers, ending with founding of the United Nations (1945).'
        ],
        formulaOrExample: 'Post-War establishment: United Nations, Universal Declaration of Human Rights'
      }
    ]
  }
];

export const INITIAL_NOTES: Note[] = [
  {
    id: 'note-1',
    title: '📐 Calculus: Quick Reference for Derivatives',
    content: `# Key Derivative Formulas\n\n- **Power Rule:** d/dx[xⁿ] = n·xⁿ⁻¹\n- **Product Rule:** (fg)' = f'g + fg'\n- **Quotient Rule:** (f/g)' = (f'g - fg') / g²\n- **Chain Rule:** d/dx[f(g(x))] = f'(g(x)) · g'(x)\n\n### Trig Derivatives:\n- sin(x) → cos(x)\n- cos(x) → -sin(x)\n- tan(x) → sec²(x)\n- eˣ → eˣ\n- ln(x) → 1/x\n\n*Remember to review related rates before the Friday exam!*`,
    subjectId: 'calculus',
    colorTag: '#8B5CF6',
    isPinned: true,
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 86400000 * 1,
    tags: ['Exam Prep', 'Formulas', 'Calculus'],
    checklist: [
      { id: 'c1', text: 'Memorize trig derivatives', done: true },
      { id: 'c2', text: 'Practice 5 chain rule problems', done: true },
      { id: 'c3', text: 'Complete Chapter 4 review exercises', done: false }
    ]
  },
  {
    id: 'note-2',
    title: '⚡ Physics: Newton\'s Laws & Mechanics Summary',
    content: `## Mechanics Core Concepts\n\n1. **First Law (Inertia):** Objects maintain state of rest/motion unless net force != 0\n2. **Second Law:** F = ma\n3. **Third Law:** Action = -Reaction\n\n### Free-Body Diagram Checklist:\n- Gravity force (mg downward)\n- Normal force (perpendicular to surface)\n- Friction force (opposing motion: μ · N)\n- Tension (along strings/cables)\n\n*Always resolve forces into x and y components before applying Newton's 2nd Law!*`,
    subjectId: 'physics',
    colorTag: '#0EA5E9',
    isPinned: true,
    createdAt: Date.now() - 86400000 * 3,
    updatedAt: Date.now() - 86400000 * 2,
    tags: ['Physics', 'Mechanics', 'FBD'],
    checklist: [
      { id: 'c4', text: 'Draw inclined plane FBDs', done: true },
      { id: 'c5', text: 'Solve frictionless pulley problem', done: false }
    ]
  },
  {
    id: 'note-3',
    title: '🧬 Biology: Mitosis vs Meiosis Cheat Sheet',
    content: `### Mitosis (Somatic Cells)\n- Produces 2 identical diploid (2n) daughter cells\n- One round of division\n- Phases: Prophase, Metaphase, Anaphase, Telophase (PMAT)\n\n### Meiosis (Gametes/Sex Cells)\n- Produces 4 unique haploid (n) daughter cells\n- Two rounds of division (Meiosis I & Meiosis II)\n- Crossing over occurs during Prophase I\n- Creates genetic variation through independent assortment`,
    subjectId: 'biology',
    colorTag: '#10B981',
    isPinned: false,
    createdAt: Date.now() - 86400000 * 4,
    updatedAt: Date.now() - 86400000 * 3,
    tags: ['Biology', 'Genetics', 'Cell Division']
  },
  {
    id: 'note-4',
    title: '💻 CS: Big-O Complexity & Data Structures',
    content: `## Big-O Efficiency Overview\n\n- **O(1) Constant:** Hash map lookup, array index access\n- **O(log n) Logarithmic:** Binary search on sorted array\n- **O(n) Linear:** Linear scan through array / linked list\n- **O(n log n) Linearithmic:** Merge Sort, Quick Sort (avg), Heap Sort\n- **O(n²) Quadratic:** Bubble Sort, Nested loops\n\n*Tip: Stacks are LIFO, Queues are FIFO!*`,
    subjectId: 'cs',
    colorTag: '#6366F1',
    isPinned: false,
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now() - 86400000 * 4,
    tags: ['Algorithms', 'Data Structures', 'CS']
  }
];

export const INITIAL_QUESTIONS: QuizQuestion[] = [
  // Mathematics
  {
    id: 'q-m1',
    subjectId: 'math',
    type: 'multiple-choice',
    question: 'What is the solution for x in the equation 2x + 7 = 19?',
    options: ['x = 5', 'x = 6', 'x = 7', 'x = 12'],
    correctAnswer: 'x = 6',
    explanation: 'Subtract 7 from both sides: 2x = 12. Then divide by 2: x = 6.',
    hint: 'Isolate 2x first by subtracting 7.',
    difficulty: 'easy'
  },
  {
    id: 'q-m2',
    subjectId: 'math',
    type: 'solving',
    question: 'Find the discriminant (Δ = b² - 4ac) for the quadratic equation 2x² + 5x - 3 = 0. Enter only the number.',
    correctAnswer: '49',
    explanation: 'Here a = 2, b = 5, c = -3. Δ = (5)² - 4(2)(-3) = 25 - (-24) = 25 + 24 = 49.',
    hint: 'Use the formula b² - 4ac with a=2, b=5, c=-3.',
    difficulty: 'medium'
  },
  {
    id: 'q-m3',
    subjectId: 'math',
    type: 'identification',
    question: 'What theorem states that in a right-angled triangle, the square of the hypotenuse is equal to the sum of the squares of the other two sides?',
    correctAnswer: 'Pythagorean Theorem',
    explanation: 'The Pythagorean theorem (a² + b² = c²) relates the sides of any right triangle.',
    hint: 'Named after the ancient Greek mathematician Pythagoras.',
    difficulty: 'easy'
  },
  {
    id: 'q-m4',
    subjectId: 'math',
    type: 'numeration',
    question: 'Calculate the value of 5! (5 factorial).',
    correctAnswer: '120',
    explanation: '5! = 5 × 4 × 3 × 2 × 1 = 120.',
    hint: 'Multiply 5 by each integer down to 1.',
    difficulty: 'easy'
  },

  // Calculus
  {
    id: 'q-c1',
    subjectId: 'calculus',
    type: 'multiple-choice',
    question: 'What is the derivative of f(x) = 3x⁴ - 5x² + 7?',
    options: [
      'f’(x) = 12x³ - 10x',
      'f’(x) = 12x³ - 10x + 7',
      'f’(x) = 7x³ - 10x',
      'f’(x) = 3x³ - 5x'
    ],
    correctAnswer: 'f’(x) = 12x³ - 10x',
    explanation: 'Using the power rule: d/dx[3x⁴] = 12x³, d/dx[-5x²] = -10x, and d/dx[7] = 0.',
    hint: 'Apply the power rule d/dx[xⁿ] = n·xⁿ⁻¹ to each term.',
    difficulty: 'easy'
  },
  {
    id: 'q-c2',
    subjectId: 'calculus',
    type: 'multiple-choice',
    question: 'What is the derivative of sin(x)?',
    options: ['cos(x)', '-cos(x)', 'tan(x)', '-sin(x)'],
    correctAnswer: 'cos(x)',
    explanation: 'The derivative of the sine function is the cosine function: d/dx[sin(x)] = cos(x).',
    hint: 'Think about the standard trigonometric derivative rules.',
    difficulty: 'easy'
  },
  {
    id: 'q-c3',
    subjectId: 'calculus',
    type: 'solving',
    question: 'Evaluate the definite integral ∫ from 0 to 2 of (3x²) dx. Enter only the integer answer.',
    correctAnswer: '8',
    explanation: 'The anti-derivative of 3x² is x³. Evaluating from 0 to 2 gives: 2³ - 0³ = 8.',
    hint: 'Find the anti-derivative of 3x² first, which is x³.',
    difficulty: 'medium'
  },

  // Physics
  {
    id: 'q-p1',
    subjectId: 'physics',
    type: 'multiple-choice',
    question: 'A car with mass 1,000 kg accelerates at 3 m/s². What is the net force acting on the car?',
    options: ['333 N', '3,000 N', '300 N', '30,000 N'],
    correctAnswer: '3,000 N',
    explanation: 'Newton’s Second Law states F = m · a. Therefore, F = 1000 kg × 3 m/s² = 3000 N.',
    hint: 'Use Newton’s Second Law: F = m × a.',
    difficulty: 'easy'
  },
  {
    id: 'q-p2',
    subjectId: 'physics',
    type: 'identification',
    question: 'What physical law states that current (I) is directly proportional to voltage (V) and inversely proportional to resistance (R)?',
    correctAnswer: "Ohm's Law",
    explanation: 'Ohm’s law is expressed mathematically as V = I · R or I = V / R.',
    hint: 'Named after the German physicist Georg Ohm.',
    difficulty: 'easy'
  },
  {
    id: 'q-p3',
    subjectId: 'physics',
    type: 'numeration',
    question: 'If a 2 kg object is moving at a speed of 4 m/s, what is its kinetic energy in Joules (KE = ½mv²)? Enter only the number.',
    correctAnswer: '16',
    explanation: 'KE = ½ · m · v² = 0.5 × 2 × (4)² = 1 × 16 = 16 Joules.',
    hint: 'KE = ½ × 2 × 16.',
    difficulty: 'easy'
  },

  // Biology
  {
    id: 'q-b1',
    subjectId: 'biology',
    type: 'identification',
    question: 'Which organelle is often referred to as the "powerhouse of the cell" because it generates most of the chemical energy (ATP)?',
    correctAnswer: 'Mitochondria',
    explanation: 'Mitochondria produce ATP through cellular respiration, providing energy for cellular metabolic processes.',
    hint: 'It starts with the letter M and contains its own circular DNA.',
    difficulty: 'easy'
  },
  {
    id: 'q-b2',
    subjectId: 'biology',
    type: 'multiple-choice',
    question: 'In DNA base pairing, which nucleotide base always pairs with Adenine (A)?',
    options: ['Cytosine (C)', 'Guanine (G)', 'Thymine (T)', 'Uracil (U)'],
    correctAnswer: 'Thymine (T)',
    explanation: 'In DNA, Adenine (A) pairs with Thymine (T) via 2 hydrogen bonds. In RNA, Uracil (U) replaces Thymine.',
    hint: 'Remember the mnemonic: Apple in the Tree (A-T), Car in the Garage (C-G).',
    difficulty: 'easy'
  },
  {
    id: 'q-b3',
    subjectId: 'biology',
    type: 'multiple-choice',
    question: 'During which phase of mitosis do chromosomes align along the equatorial plane of the cell?',
    options: ['Prophase', 'Metaphase', 'Anaphase', 'Telophase'],
    correctAnswer: 'Metaphase',
    explanation: 'In Metaphase (M for "Middle"), sister chromatids align along the cell equator (metaphase plate).',
    hint: 'Think "M" for Middle.',
    difficulty: 'medium'
  },

  // Computer Studies
  {
    id: 'q-cs1',
    subjectId: 'cs',
    type: 'multiple-choice',
    question: 'Which data structure operates on a "Last-In, First-Out" (LIFO) principle?',
    options: ['Queue', 'Stack', 'Linked List', 'Binary Tree'],
    correctAnswer: 'Stack',
    explanation: 'A Stack follows LIFO (e.g. stack of plates), whereas a Queue follows FIFO (First-In, First-Out).',
    hint: 'Think of undo history or a stack of plates.',
    difficulty: 'easy'
  },
  {
    id: 'q-cs2',
    subjectId: 'cs',
    type: 'identification',
    question: 'What is the name of the search algorithm that repeatedly divides a sorted list in half to find a target value in O(log n) time?',
    correctAnswer: 'Binary Search',
    explanation: 'Binary Search has O(log n) time complexity because it cuts the remaining search range in half each step.',
    hint: 'It divides into two ("bi-") halves.',
    difficulty: 'easy'
  },
  {
    id: 'q-cs3',
    subjectId: 'cs',
    type: 'multiple-choice',
    question: 'Which of the following is NOT one of the 4 fundamental pillars of Object-Oriented Programming (OOP)?',
    options: ['Encapsulation', 'Polymorphism', 'Compilation', 'Inheritance'],
    correctAnswer: 'Compilation',
    explanation: 'The four pillars of OOP are Encapsulation, Abstraction, Inheritance, and Polymorphism. Compilation is a language translation step.',
    hint: 'Think about which term describes the compiler building code rather than an OOP design principle.',
    difficulty: 'medium'
  },

  // Chemistry & Science
  {
    id: 'q-s1',
    subjectId: 'science',
    type: 'multiple-choice',
    question: 'A solution with a pH of 3 is considered:',
    options: ['Neutral', 'Strongly Basic', 'Acidic', 'Alkaline'],
    correctAnswer: 'Acidic',
    explanation: 'Values below pH 7 are acidic, pH 7 is neutral, and values above pH 7 are basic/alkaline.',
    hint: 'On the pH scale of 0-14, pH 7 is neutral.',
    difficulty: 'easy'
  },
  {
    id: 'q-s2',
    subjectId: 'science',
    type: 'identification',
    question: 'What is the chemical symbol for the element Gold?',
    correctAnswer: 'Au',
    explanation: 'Gold comes from the Latin word "Aurum", giving it the symbol Au (Atomic Number 79).',
    hint: 'Derived from the Latin word "Aurum". Two letters.',
    difficulty: 'easy'
  },

  // English & Humanities
  {
    id: 'q-e1',
    subjectId: 'english',
    type: 'multiple-choice',
    question: 'Which figure of speech is used in the phrase: "The autumn leaves danced across the pavement"?',
    options: ['Metaphor', 'Personification', 'Hyperbole', 'Alliteration'],
    correctAnswer: 'Personification',
    explanation: 'Personification gives human characteristics (dancing) to non-human objects (autumn leaves).',
    hint: 'It gives human traits to an inanimate object.',
    difficulty: 'easy'
  },
  {
    id: 'q-e2',
    subjectId: 'english',
    type: 'identification',
    question: 'What acronym is used to remember the seven coordinating conjunctions: For, And, Nor, But, Or, Yet, So?',
    correctAnswer: 'FANBOYS',
    explanation: 'FANBOYS stands for For, And, Nor, But, Or, Yet, So.',
    hint: 'Starts with F and ends with S.',
    difficulty: 'easy'
  }
];

export const MOTIVATIONAL_QUOTES = [
  { text: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
  { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
  { text: "The secret to getting ahead is getting started.", author: "Mark Twain" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { text: "Focus is a muscle. The more you study with intention, the stronger it grows.", author: "StudyMate Tip" }
];
