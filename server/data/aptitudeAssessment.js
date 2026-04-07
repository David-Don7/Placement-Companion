/**
 * First-Login Aptitude Assessment Questions
 * 15 MCQs across: Quantitative, Logical Reasoning, Pattern Recognition, Analytical Thinking
 */
const aptitudeAssessmentQuestions = [
  // ---- Quantitative Aptitude (4 questions) ----
  {
    id: 1,
    category: 'Quantitative Aptitude',
    question: 'A train 150 m long passes a pole in 15 seconds. What is the speed of the train in km/hr?',
    options: ['36 km/hr', '32 km/hr', '40 km/hr', '28 km/hr'],
    correctAnswer: 0
  },
  {
    id: 2,
    category: 'Quantitative Aptitude',
    question: 'If the cost price of 20 articles is equal to the selling price of 16 articles, what is the profit percentage?',
    options: ['20%', '25%', '30%', '16%'],
    correctAnswer: 1
  },
  {
    id: 3,
    category: 'Quantitative Aptitude',
    question: 'Two pipes can fill a tank in 12 minutes and 18 minutes respectively. If both are opened simultaneously, how long will it take to fill the tank?',
    options: ['6.5 min', '7.2 min', '8.0 min', '9.0 min'],
    correctAnswer: 1
  },
  {
    id: 4,
    category: 'Quantitative Aptitude',
    question: 'What is 35% of 240?',
    options: ['74', '80', '84', '90'],
    correctAnswer: 2
  },

  // ---- Logical Reasoning (4 questions) ----
  {
    id: 5,
    category: 'Logical Reasoning',
    question: 'All roses are flowers. Some flowers fade quickly. Which conclusion follows?',
    options: [
      'All roses fade quickly',
      'Some roses fade quickly',
      'Some roses may fade quickly',
      'No roses fade quickly'
    ],
    correctAnswer: 2
  },
  {
    id: 6,
    category: 'Logical Reasoning',
    question: 'If APPLE is coded as ELPPA, how is MANGO coded?',
    options: ['OGNAM', 'OGANM', 'ONAGM', 'OGMAN'],
    correctAnswer: 0
  },
  {
    id: 7,
    category: 'Logical Reasoning',
    question: 'Pointing to a photograph, Arun said "She is the daughter of my grandfather\'s only son." How is the person in the photograph related to Arun?',
    options: ['Sister', 'Mother', 'Cousin', 'Aunt'],
    correctAnswer: 0
  },
  {
    id: 8,
    category: 'Logical Reasoning',
    question: 'In a row of 40 students, Ramesh is 13th from the left and Suresh is 9th from the right. How many students are between them?',
    options: ['17', '18', '19', '20'],
    correctAnswer: 2
  },

  // ---- Pattern Recognition (4 questions) ----
  {
    id: 9,
    category: 'Pattern Recognition',
    question: 'What comes next in the series: 2, 6, 12, 20, 30, ?',
    options: ['40', '42', '44', '38'],
    correctAnswer: 1
  },
  {
    id: 10,
    category: 'Pattern Recognition',
    question: 'Find the missing number: 3, 9, 27, 81, ?',
    options: ['162', '243', '216', '324'],
    correctAnswer: 1
  },
  {
    id: 11,
    category: 'Pattern Recognition',
    question: 'What comes next: A1, B2, C3, D4, ?',
    options: ['F5', 'E5', 'E6', 'F6'],
    correctAnswer: 1
  },
  {
    id: 12,
    category: 'Pattern Recognition',
    question: 'Find the odd one out: 2, 3, 5, 7, 11, 14, 17',
    options: ['2', '11', '14', '17'],
    correctAnswer: 2
  },

  // ---- Analytical Thinking (3 questions) ----
  {
    id: 13,
    category: 'Analytical Thinking',
    question: 'A farmer has 17 sheep. All but 9 die. How many sheep does the farmer have left?',
    options: ['8', '9', '17', '0'],
    correctAnswer: 1
  },
  {
    id: 14,
    category: 'Analytical Thinking',
    question: 'If it takes 5 machines 5 minutes to make 5 widgets, how long would it take 100 machines to make 100 widgets?',
    options: ['100 minutes', '5 minutes', '20 minutes', '50 minutes'],
    correctAnswer: 1
  },
  {
    id: 15,
    category: 'Analytical Thinking',
    question: 'A clock shows 3:15. What is the angle between the hour and minute hands?',
    options: ['0°', '7.5°', '15°', '22.5°'],
    correctAnswer: 1
  }
];

module.exports = aptitudeAssessmentQuestions;
