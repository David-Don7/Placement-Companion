const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Question = require('./models/Question');
const Company = require('./models/Company');
const SurveyQuestion = require('./models/SurveyQuestion');
const TestCase = require('./models/TestCase');
const CodeTemplate = require('./models/CodeTemplate');

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI);
  console.log(`MongoDB Connected: ${conn.connection.host}`);
};

const aptitudeQuestions = [
  // Quantitative
  {
    type: 'aptitude', topic: 'Quantitative', difficulty: 'easy',
    question: 'If a train travels 360 km in 4 hours, what is its speed?',
    options: ['80 km/h', '90 km/h', '100 km/h', '70 km/h'],
    answer: 1, solution: 'Speed = Distance / Time = 360 / 4 = 90 km/h'
  },
  {
    type: 'aptitude', topic: 'Quantitative', difficulty: 'easy',
    question: 'What is 25% of 200?',
    options: ['40', '50', '60', '45'],
    answer: 1, solution: '25% of 200 = (25/100) × 200 = 50'
  },
  {
    type: 'aptitude', topic: 'Quantitative', difficulty: 'medium',
    question: 'A man bought an article for ₹800 and sold it for ₹920. What is the profit percentage?',
    options: ['12%', '15%', '18%', '20%'],
    answer: 1, solution: 'Profit = 920 - 800 = 120. Profit% = (120/800) × 100 = 15%'
  },
  {
    type: 'aptitude', topic: 'Quantitative', difficulty: 'medium',
    question: 'If the ratio of boys to girls in a class is 3:2, and total students are 50, how many boys are there?',
    options: ['25', '30', '20', '35'],
    answer: 1, solution: 'Boys = (3/5) × 50 = 30'
  },
  {
    type: 'aptitude', topic: 'Quantitative', difficulty: 'hard',
    question: 'A pipe can fill a tank in 12 hours and another pipe can empty it in 18 hours. If both pipes are opened, how long will it take to fill the tank?',
    options: ['30 hours', '36 hours', '24 hours', '42 hours'],
    answer: 1, solution: 'Net rate = 1/12 - 1/18 = (3-2)/36 = 1/36. Time = 36 hours'
  },
  {
    type: 'aptitude', topic: 'Quantitative', difficulty: 'easy',
    question: 'What is the simple interest on ₹5000 at 10% per annum for 2 years?',
    options: ['₹800', '₹1000', '₹1200', '₹900'],
    answer: 1, solution: 'SI = P × R × T / 100 = 5000 × 10 × 2 / 100 = ₹1000'
  },
  {
    type: 'aptitude', topic: 'Quantitative', difficulty: 'medium',
    question: 'The average of 5 numbers is 42. If one number is excluded, the average becomes 38. What is the excluded number?',
    options: ['52', '58', '48', '62'],
    answer: 1, solution: 'Sum of 5 = 210. Sum of 4 = 152. Excluded = 210 - 152 = 58'
  },
  {
    type: 'aptitude', topic: 'Quantitative', difficulty: 'hard',
    question: 'Two trains start from stations A and B towards each other at speeds of 50 km/h and 60 km/h. They are 440 km apart. When will they meet?',
    options: ['3 hours', '4 hours', '5 hours', '3.5 hours'],
    answer: 1, solution: 'Relative speed = 50 + 60 = 110 km/h. Time = 440/110 = 4 hours'
  },
  {
    type: 'aptitude', topic: 'Quantitative', difficulty: 'easy',
    question: 'What is the LCM of 12 and 18?',
    options: ['24', '36', '48', '72'],
    answer: 1, solution: '12 = 2² × 3, 18 = 2 × 3². LCM = 2² × 3² = 36'
  },
  {
    type: 'aptitude', topic: 'Quantitative', difficulty: 'medium',
    question: 'A can do a work in 15 days and B can do it in 20 days. In how many days will they finish together?',
    options: ['8 4/7 days', '7 days', '9 days', '10 days'],
    answer: 0, solution: 'Combined rate = 1/15 + 1/20 = 7/60. Time = 60/7 = 8 4/7 days'
  },

  // Logical Reasoning
  {
    type: 'aptitude', topic: 'Logical Reasoning', difficulty: 'easy',
    question: 'Find the next number: 2, 6, 12, 20, 30, ?',
    options: ['40', '42', '44', '38'],
    answer: 1, solution: 'Differences: 4, 6, 8, 10, 12. Next = 30 + 12 = 42'
  },
  {
    type: 'aptitude', topic: 'Logical Reasoning', difficulty: 'easy',
    question: 'If APPLE is coded as ELPPA, how is MANGO coded?',
    options: ['OGNAM', 'OGNMA', 'OGANM', 'OGAMN'],
    answer: 0, solution: 'The word is reversed. MANGO reversed = OGNAM'
  },
  {
    type: 'aptitude', topic: 'Logical Reasoning', difficulty: 'medium',
    question: 'Pointing to a photograph, Arun said "She is the daughter of my grandfather\'s only son." How is the person in the photograph related to Arun?',
    options: ['Sister', 'Mother', 'Daughter', 'Aunt'],
    answer: 0, solution: 'Grandfather\'s only son = Arun\'s father. Father\'s daughter = Arun\'s sister.'
  },
  {
    type: 'aptitude', topic: 'Logical Reasoning', difficulty: 'medium',
    question: 'All roses are flowers. Some flowers are red. Which statement must be true?',
    options: ['Some roses may be red', 'All roses are red', 'No roses are red', 'All flowers are roses'],
    answer: 0, solution: 'Since all roses are flowers and some flowers are red, it is possible (but not certain) that some roses are red.'
  },
  {
    type: 'aptitude', topic: 'Logical Reasoning', difficulty: 'hard',
    question: 'In a row of 40 students, P is 10th from the left and Q is 20th from the right. How many students are between P and Q?',
    options: ['9', '10', '11', '12'],
    answer: 1, solution: 'Q from left = 40 - 20 + 1 = 21st. Between P(10th) and Q(21st) = 21 - 10 - 1 = 10'
  },
  {
    type: 'aptitude', topic: 'Logical Reasoning', difficulty: 'easy',
    question: 'If Monday = 1, Tuesday = 2, ..., then what is Wednesday + Friday?',
    options: ['7', '8', '9', '10'],
    answer: 1, solution: 'Wednesday = 3, Friday = 5. Sum = 3 + 5 = 8'
  },
  {
    type: 'aptitude', topic: 'Logical Reasoning', difficulty: 'medium',
    question: 'A clock shows 3:15. What is the angle between the hour and minute hands?',
    options: ['0°', '7.5°', '15°', '22.5°'],
    answer: 1, solution: 'At 3:15, minute hand at 90°. Hour hand at 90° + 7.5° = 97.5°. Angle = 7.5°'
  },
  {
    type: 'aptitude', topic: 'Logical Reasoning', difficulty: 'hard',
    question: 'Five people A, B, C, D, E sit in a circle. A is between D and E. B is to the right of E. Who is to the left of C?',
    options: ['D', 'B', 'A', 'E'],
    answer: 0, solution: 'Arrangement: D-A-E-B-C (clockwise). D is to the left of C.'
  },
  {
    type: 'aptitude', topic: 'Logical Reasoning', difficulty: 'easy',
    question: 'Odd one out: 3, 5, 7, 12, 17, 19',
    options: ['12', '3', '5', '19'],
    answer: 0, solution: '12 is the only even number. All others are odd/prime.'
  },
  {
    type: 'aptitude', topic: 'Logical Reasoning', difficulty: 'medium',
    question: 'If A > B, B > C, C > D, which is definitely true?',
    options: ['A > D', 'B > D and A > C', 'All of these', 'A > C'],
    answer: 2, solution: 'A > B > C > D, so A > D, A > C, and B > D are all true.'
  },

  // Verbal Ability
  {
    type: 'aptitude', topic: 'Verbal Ability', difficulty: 'easy',
    question: 'Choose the synonym of "Abundant":',
    options: ['Rare', 'Plentiful', 'Scarce', 'Minimal'],
    answer: 1, solution: 'Abundant means existing in large quantities, synonym is Plentiful.'
  },
  {
    type: 'aptitude', topic: 'Verbal Ability', difficulty: 'easy',
    question: 'Choose the antonym of "Brave":',
    options: ['Bold', 'Cowardly', 'Fearless', 'Valiant'],
    answer: 1, solution: 'Brave means courageous. Its antonym is Cowardly.'
  },
  {
    type: 'aptitude', topic: 'Verbal Ability', difficulty: 'medium',
    question: 'Fill in the blank: "She was too tired ___ continue working."',
    options: ['to', 'for', 'of', 'with'],
    answer: 0, solution: '"Too + adjective + to + verb" is the correct structure.'
  },
  {
    type: 'aptitude', topic: 'Verbal Ability', difficulty: 'medium',
    question: 'Identify the correctly spelled word:',
    options: ['Accomodation', 'Accommodation', 'Acomodation', 'Accommadation'],
    answer: 1, solution: 'Accommodation is the correct spelling with double c and double m.'
  },
  {
    type: 'aptitude', topic: 'Verbal Ability', difficulty: 'hard',
    question: 'Choose the correct meaning of the idiom "Burning the midnight oil":',
    options: ['Wasting resources', 'Working late into the night', 'Starting a fire', 'Being angry'],
    answer: 1, solution: '"Burning the midnight oil" means studying or working late at night.'
  },
  {
    type: 'aptitude', topic: 'Verbal Ability', difficulty: 'easy',
    question: 'Which sentence is grammatically correct?',
    options: ['He go to school daily.', 'He goes to school daily.', 'He going to school daily.', 'He gone to school daily.'],
    answer: 1, solution: 'Third person singular uses "goes" with simple present tense.'
  },
  {
    type: 'aptitude', topic: 'Verbal Ability', difficulty: 'medium',
    question: '"To let the cat out of the bag" means:',
    options: ['To release a cat', 'To reveal a secret', 'To be careless', 'To start a fight'],
    answer: 1, solution: 'This idiom means to reveal a secret or disclose something hidden.'
  },
  {
    type: 'aptitude', topic: 'Verbal Ability', difficulty: 'hard',
    question: 'Choose the word that best completes: "The professor\'s lecture was so ___ that many students fell asleep."',
    options: ['Riveting', 'Monotonous', 'Captivating', 'Engaging'],
    answer: 1, solution: 'Monotonous (dull and repetitive) fits the context of students falling asleep.'
  },
  {
    type: 'aptitude', topic: 'Verbal Ability', difficulty: 'easy',
    question: 'Choose the synonym of "Commence":',
    options: ['End', 'Begin', 'Continue', 'Pause'],
    answer: 1, solution: 'Commence means to begin or start something.'
  },
  {
    type: 'aptitude', topic: 'Verbal Ability', difficulty: 'medium',
    question: 'Which sentence uses the passive voice?',
    options: ['She wrote the letter.', 'The letter was written by her.', 'She is writing a letter.', 'She will write a letter.'],
    answer: 1, solution: '"The letter was written by her" is in passive voice (object becomes subject).'
  }
];

const dsaQuestions = [
  // Arrays
  { type: 'dsa', topic: 'Arrays', difficulty: 'easy', question: 'Two Sum - Find two numbers that add up to a target', solution: 'Use a hash map to store complement values. For each element, check if its complement exists in the map. Time: O(n), Space: O(n).' },
  { type: 'dsa', topic: 'Arrays', difficulty: 'easy', question: 'Find the maximum element in an array', solution: 'Iterate through the array keeping track of the maximum. Time: O(n), Space: O(1).' },
  { type: 'dsa', topic: 'Arrays', difficulty: 'medium', question: 'Container With Most Water', solution: 'Use two pointers from both ends. Move the pointer with the shorter height inward. Time: O(n), Space: O(1).' },
  { type: 'dsa', topic: 'Arrays', difficulty: 'medium', question: 'Rotate Array by K positions', solution: 'Reverse the entire array, then reverse first k elements, then reverse remaining. Time: O(n), Space: O(1).' },
  { type: 'dsa', topic: 'Arrays', difficulty: 'hard', question: 'Trapping Rain Water', solution: 'Use two pointers or precompute left_max and right_max arrays. Sum min(left_max, right_max) - height for each position. Time: O(n).' },

  // Strings
  { type: 'dsa', topic: 'Strings', difficulty: 'easy', question: 'Reverse a String', solution: 'Use two pointers swapping characters from both ends. Time: O(n), Space: O(1) if in-place.' },
  { type: 'dsa', topic: 'Strings', difficulty: 'easy', question: 'Check if a string is a palindrome', solution: 'Compare characters from both ends moving inward. Time: O(n), Space: O(1).' },
  { type: 'dsa', topic: 'Strings', difficulty: 'medium', question: 'Longest Substring Without Repeating Characters', solution: 'Use sliding window with a set/map. Expand right pointer, shrink left when duplicate found. Time: O(n).' },
  { type: 'dsa', topic: 'Strings', difficulty: 'medium', question: 'Group Anagrams', solution: 'Sort each string and use sorted version as hash key. Group strings with same key. Time: O(n * k log k).' },
  { type: 'dsa', topic: 'Strings', difficulty: 'hard', question: 'Longest Palindromic Substring', solution: 'Expand around center for each character (odd & even length). Or use DP. Time: O(n²), Space: O(1) for expand approach.' },

  // Linked List
  { type: 'dsa', topic: 'Linked List', difficulty: 'easy', question: 'Reverse a Linked List', solution: 'Use three pointers: prev, curr, next. Iteratively reverse links. Time: O(n), Space: O(1).' },
  { type: 'dsa', topic: 'Linked List', difficulty: 'easy', question: 'Detect cycle in a Linked List', solution: 'Use Floyd\'s Tortoise and Hare. Slow moves 1 step, fast moves 2 steps. If they meet, cycle exists. Time: O(n), Space: O(1).' },
  { type: 'dsa', topic: 'Linked List', difficulty: 'medium', question: 'Merge Two Sorted Lists', solution: 'Use a dummy head, compare nodes from both lists. Time: O(n+m), Space: O(1).' },
  { type: 'dsa', topic: 'Linked List', difficulty: 'medium', question: 'Remove Nth Node From End of List', solution: 'Use two pointers with n gap. When fast reaches end, slow is at the node to remove. Time: O(n).' },
  { type: 'dsa', topic: 'Linked List', difficulty: 'hard', question: 'Merge K Sorted Lists', solution: 'Use a min-heap to always pick the smallest head. Push next node of the picked list. Time: O(N log k).' },

  // Stack & Queue
  { type: 'dsa', topic: 'Stack', difficulty: 'easy', question: 'Valid Parentheses - Check balanced brackets', solution: 'Push opening brackets to stack. For closing, check top matches. Stack must be empty at end. Time: O(n).' },
  { type: 'dsa', topic: 'Stack', difficulty: 'medium', question: 'Min Stack - getMin in O(1)', solution: 'Maintain auxiliary stack storing minimums. Push to min stack when value <= current min. Time: O(1) for all operations.' },
  { type: 'dsa', topic: 'Queue', difficulty: 'easy', question: 'Implement Queue using Stacks', solution: 'Use two stacks. Push to stack1. For dequeue, if stack2 empty, transfer all from stack1. Pop from stack2.' },
  { type: 'dsa', topic: 'Queue', difficulty: 'medium', question: 'Sliding Window Maximum', solution: 'Use a deque storing indices. Remove elements outside window and smaller elements. Front always has max. Time: O(n).' },
  { type: 'dsa', topic: 'Stack', difficulty: 'hard', question: 'Largest Rectangle in Histogram', solution: 'Use a stack to find next smaller on left and right for each bar. Area = height × width. Time: O(n).' },

  // Trees
  { type: 'dsa', topic: 'Trees', difficulty: 'easy', question: 'Maximum Depth of Binary Tree', solution: 'Recursively: return 1 + max(depth(left), depth(right)). Base case: null returns 0. Time: O(n).' },
  { type: 'dsa', topic: 'Trees', difficulty: 'easy', question: 'Inorder Traversal of Binary Tree', solution: 'Recursive: traverse left, visit node, traverse right. Iterative: use stack, go left until null, pop and visit, go right.' },
  { type: 'dsa', topic: 'Trees', difficulty: 'medium', question: 'Validate Binary Search Tree', solution: 'Use min/max range for each node. Left child must be < node, right child must be > node. Pass ranges recursively.' },
  { type: 'dsa', topic: 'Trees', difficulty: 'medium', question: 'Level Order Traversal (BFS)', solution: 'Use a queue. Process level by level, storing each level\'s values. Time: O(n), Space: O(n).' },
  { type: 'dsa', topic: 'Trees', difficulty: 'hard', question: 'Serialize and Deserialize Binary Tree', solution: 'Use preorder traversal with null markers. Serialize to string. Deserialize by reading tokens and building tree recursively.' },

  // Graphs
  { type: 'dsa', topic: 'Graphs', difficulty: 'easy', question: 'BFS traversal of a graph', solution: 'Use a queue and visited set. Start from source, explore neighbors level by level. Time: O(V+E).' },
  { type: 'dsa', topic: 'Graphs', difficulty: 'medium', question: 'Detect Cycle in Undirected Graph', solution: 'Use DFS with parent tracking. If visited neighbor is not parent, cycle exists. Or use Union-Find. Time: O(V+E).' },
  { type: 'dsa', topic: 'Graphs', difficulty: 'medium', question: 'Number of Islands', solution: 'Iterate grid, for each "1" do BFS/DFS to mark connected land as visited. Count number of BFS/DFS calls. Time: O(m×n).' },
  { type: 'dsa', topic: 'Graphs', difficulty: 'hard', question: 'Dijkstra\'s Shortest Path Algorithm', solution: 'Use min-heap with (distance, node). Relax edges greedily. Time: O((V+E) log V) with binary heap.' },
  { type: 'dsa', topic: 'Graphs', difficulty: 'hard', question: 'Topological Sort', solution: 'Use DFS post-order (reverse finish) or Kahn\'s BFS with in-degree. Works only on DAGs. Time: O(V+E).' },

  // Dynamic Programming
  { type: 'dsa', topic: 'Dynamic Programming', difficulty: 'easy', question: 'Climbing Stairs - Count ways to reach nth step', solution: 'dp[i] = dp[i-1] + dp[i-2]. Same as Fibonacci. Base: dp[1]=1, dp[2]=2. Time: O(n), Space: O(1).' },
  { type: 'dsa', topic: 'Dynamic Programming', difficulty: 'easy', question: 'Maximum Subarray Sum (Kadane\'s Algorithm)', solution: 'Track current_sum = max(num, current_sum + num). Track global max. Time: O(n), Space: O(1).' },
  { type: 'dsa', topic: 'Dynamic Programming', difficulty: 'medium', question: '0/1 Knapsack Problem', solution: 'dp[i][w] = max(dp[i-1][w], val[i] + dp[i-1][w-wt[i]]). Can optimize to 1D. Time: O(nW).' },
  { type: 'dsa', topic: 'Dynamic Programming', difficulty: 'medium', question: 'Longest Common Subsequence', solution: 'dp[i][j] = dp[i-1][j-1]+1 if match, else max(dp[i-1][j], dp[i][j-1]). Time: O(mn).' },
  { type: 'dsa', topic: 'Dynamic Programming', difficulty: 'hard', question: 'Edit Distance (Levenshtein Distance)', solution: 'dp[i][j] = min(insert, delete, replace). If chars match, dp[i-1][j-1]. Time: O(mn), Space: O(mn) or O(n).' }
];

const hrQuestions = [
  {
    type: 'hr', topic: 'behavioral', difficulty: 'easy',
    question: 'Tell me about yourself.',
    tips: ['Keep it professional and concise (1-2 minutes)', 'Follow present-past-future structure', 'Highlight key skills and achievements'],
    keywords: ['education', 'experience', 'skills', 'passionate', 'goal', 'project', 'team', 'technology'],
    solution: 'I am a [year] year [branch] student at [college]. I have a strong foundation in programming and problem-solving. I have worked on projects involving [technologies] and participated in coding competitions. I am passionate about software development and eager to apply my skills in a professional environment.'
  },
  {
    type: 'hr', topic: 'behavioral', difficulty: 'easy',
    question: 'What are your strengths?',
    tips: ['Pick 2-3 relevant strengths', 'Back each with a specific example', 'Relate to job requirements'],
    keywords: ['problem-solving', 'teamwork', 'communication', 'adaptable', 'quick learner', 'leadership', 'analytical', 'dedicated'],
    solution: 'My key strengths are problem-solving and teamwork. During my college project, I led a team of 4 to build a web application. My analytical skills helped us debug complex issues efficiently, and my communication skills ensured smooth coordination with team members.'
  },
  {
    type: 'hr', topic: 'behavioral', difficulty: 'easy',
    question: 'What are your weaknesses?',
    tips: ['Be honest but strategic', 'Show self-awareness', 'Explain how you are improving'],
    keywords: ['improvement', 'working on', 'learning', 'overcome', 'aware', 'feedback', 'progress', 'develop'],
    solution: 'I sometimes focus too much on details which can slow me down. I am aware of this and have been working on time management techniques to balance thoroughness with efficiency. I now set time limits for tasks and prioritize based on impact.'
  },
  {
    type: 'hr', topic: 'behavioral', difficulty: 'medium',
    question: 'Where do you see yourself in 5 years?',
    tips: ['Show ambition aligned with company growth', 'Be realistic', 'Show commitment to the field'],
    keywords: ['growth', 'leadership', 'senior', 'expertise', 'contribute', 'learn', 'develop', 'impact', 'career'],
    solution: 'In 5 years, I see myself as a senior developer with deep expertise in my domain. I want to have contributed to impactful projects and grown into a leadership role where I can mentor junior developers while continuing to learn and innovate.'
  },
  {
    type: 'hr', topic: 'behavioral', difficulty: 'medium',
    question: 'Why should we hire you?',
    tips: ['Align your skills with job requirements', 'Show enthusiasm', 'Mention unique qualities'],
    keywords: ['skills', 'experience', 'value', 'contribute', 'team', 'learn', 'passionate', 'results', 'problem-solving'],
    solution: 'You should hire me because I bring a strong combination of technical skills, practical project experience, and a passion for learning. My academic projects demonstrate my ability to deliver results, and I am eager to contribute to your team while growing professionally.'
  },
  {
    type: 'hr', topic: 'behavioral', difficulty: 'medium',
    question: 'Tell me about a time you faced a challenge and how you overcame it.',
    tips: ['Use STAR method (Situation, Task, Action, Result)', 'Be specific', 'Show problem-solving ability'],
    keywords: ['situation', 'challenge', 'action', 'result', 'solution', 'learned', 'team', 'approach', 'overcome', 'resolved'],
    solution: 'During a hackathon, our team\'s backend crashed 2 hours before the deadline. I took charge, identified the database connection issue, implemented a fix, and redistributed tasks. We submitted on time and won second place. I learned the importance of staying calm under pressure.'
  },
  {
    type: 'hr', topic: 'behavioral', difficulty: 'hard',
    question: 'Describe a situation where you had a conflict with a team member. How did you resolve it?',
    tips: ['Show maturity and empathy', 'Focus on resolution, not blame', 'Demonstrate communication skills'],
    keywords: ['communication', 'listen', 'understand', 'compromise', 'resolved', 'perspective', 'team', 'discussion', 'professional', 'solution'],
    solution: 'During a group project, a teammate and I disagreed on the architecture. Instead of arguing, I suggested we each present our approach with pros and cons. After a constructive discussion, we found a hybrid solution that combined the best of both approaches. This improved our final product and strengthened our working relationship.'
  },
  {
    type: 'hr', topic: 'behavioral', difficulty: 'easy',
    question: 'Why do you want to work at our company?',
    tips: ['Research the company beforehand', 'Mention specific aspects you admire', 'Connect to your career goals'],
    keywords: ['culture', 'innovation', 'growth', 'technology', 'impact', 'values', 'opportunity', 'team', 'mission', 'learn'],
    solution: 'I am drawn to your company because of its culture of innovation and the impactful products you build. Your commitment to using technology to solve real-world problems aligns with my passion. I believe the learning opportunities here would help me grow significantly as a professional.'
  },
  {
    type: 'hr', topic: 'behavioral', difficulty: 'medium',
    question: 'How do you handle pressure and tight deadlines?',
    tips: ['Give specific examples', 'Show your planning/prioritization skills', 'Stay positive'],
    keywords: ['prioritize', 'plan', 'organize', 'focus', 'calm', 'deadline', 'manage', 'efficient', 'break down', 'deliver'],
    solution: 'I handle pressure by breaking tasks into smaller milestones and prioritizing by impact. During semester exams when I also had a project deadline, I created a detailed schedule, focused on high-priority items first, and communicated with my team about realistic timelines. We delivered on time without compromising quality.'
  },
  {
    type: 'hr', topic: 'behavioral', difficulty: 'hard',
    question: 'Tell me about a time you failed. What did you learn?',
    tips: ['Be genuine', 'Focus on the learning, not the failure', 'Show growth mindset'],
    keywords: ['failed', 'learned', 'mistake', 'improved', 'growth', 'responsibility', 'changed', 'approach', 'lesson', 'better'],
    solution: 'In my first hackathon, our team tried to build too ambitious a project and couldn\'t complete it. I learned the importance of scoping and MVPs. In subsequent hackathons, I always started with a minimal viable product first, then added features. This approach led my team to win two later competitions.'
  },
  {
    type: 'hr', topic: 'behavioral', difficulty: 'medium',
    question: 'What is your greatest achievement?',
    tips: ['Choose a relevant achievement', 'Quantify impact if possible', 'Show your role clearly'],
    keywords: ['achieved', 'accomplished', 'project', 'result', 'impact', 'led', 'built', 'recognition', 'team', 'award'],
    solution: 'My greatest achievement was leading a team to develop a campus event management system used by 2000+ students. I designed the architecture, coordinated with 3 teammates, and delivered the project in 6 weeks. It received recognition from the department and is still in active use.'
  },
  {
    type: 'hr', topic: 'behavioral', difficulty: 'easy',
    question: 'Do you prefer working alone or in a team?',
    tips: ['Show flexibility', 'Give examples of both', 'Relate to job context'],
    keywords: ['team', 'collaborate', 'independent', 'flexible', 'both', 'communication', 'contribute', 'learn', 'support'],
    solution: 'I enjoy both and adapt based on the task. For brainstorming and complex projects, I prefer teamwork because diverse perspectives lead to better solutions. For focused tasks like coding or debugging, I work efficiently independently. I believe a good professional should be comfortable in both settings.'
  }
];

const companies = [
  {
    name: 'Google',
    role: 'Software Engineer',
    logo: 'fab fa-google',
    logoColor: '#4285F4',
    eligibility: 'CGPA ≥ 8.0, No active backlogs',
    rounds: ['Online Assessment', 'Technical Interview 1', 'Technical Interview 2', 'HR Interview'],
    salary: '₹12-18 LPA',
    visitDate: new Date('2026-04-15'),
    pastQuestions: ['Design a URL shortener', 'Implement LRU Cache', 'Find median of two sorted arrays']
  },
  {
    name: 'Microsoft',
    role: 'Software Development Engineer',
    logo: 'fab fa-microsoft',
    logoColor: '#00A4EF',
    eligibility: 'CGPA ≥ 7.5, All branches',
    rounds: ['Online Coding Test', 'Group Discussion', 'Technical Interview', 'HR Interview'],
    salary: '₹15-22 LPA',
    visitDate: new Date('2026-04-22'),
    pastQuestions: ['Implement a binary search tree', 'Design a parking lot system', 'Merge K sorted arrays']
  },
  {
    name: 'Amazon',
    role: 'SDE Intern',
    logo: 'fab fa-amazon',
    logoColor: '#FF9900',
    eligibility: 'CGPA ≥ 7.0, CSE/IT/ECE',
    rounds: ['Online Assessment', 'Technical Interview 1', 'Technical Interview 2', 'Bar Raiser'],
    salary: '₹10-16 LPA',
    visitDate: new Date('2026-05-05'),
    pastQuestions: ['Two sum problem', 'Design an e-commerce cart', 'Detect cycle in linked list']
  },
  {
    name: 'Infosys',
    role: 'Systems Engineer',
    logo: 'fas fa-building',
    logoColor: '#007CC3',
    eligibility: 'CGPA ≥ 6.0, All branches',
    rounds: ['Online Test', 'Technical Interview', 'HR Interview'],
    salary: '₹3.6-6 LPA',
    visitDate: new Date('2026-06-10'),
    pastQuestions: ['SQL queries on joins', 'OOP concepts', 'Basic sorting algorithms']
  },
  {
    name: 'TCS',
    role: 'Assistant Systems Engineer',
    logo: 'fas fa-building-columns',
    logoColor: '#0066B3',
    eligibility: 'CGPA ≥ 6.0, No backlogs',
    rounds: ['TCS NQT', 'Technical Interview', 'Managerial Interview', 'HR Interview'],
    salary: '₹3.36-7 LPA',
    visitDate: new Date('2026-07-01'),
    pastQuestions: ['Pattern printing', 'String manipulation', 'Basic DBMS concepts']
  },
  {
    name: 'Wipro',
    role: 'Project Engineer',
    logo: 'fas fa-laptop-code',
    logoColor: '#3F1A8C',
    eligibility: 'CGPA ≥ 6.0, All branches',
    rounds: ['Online Assessment', 'Technical Interview', 'HR Interview'],
    salary: '₹3.5-5 LPA',
    visitDate: new Date('2026-08-15'),
    pastQuestions: ['Fibonacci series', 'Array manipulation', 'Basic networking concepts']
  }
];

// ============================================
// SURVEY QUESTIONS - Adaptive Assessment
// ============================================
const surveyQuestions = [
  // ===================== ARRAYS =====================
  // Beginner - Arrays
  {
    topic: 'Arrays', tier: 'beginner', questionType: 'multiple-choice',
    question: 'What is the time complexity of accessing an element in an array by index?',
    options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
    answer: 0,
    explanation: 'Arrays provide constant time O(1) access by index because elements are stored in contiguous memory locations.',
    timeLimit: 60
  },
  {
    topic: 'Arrays', tier: 'beginner', questionType: 'multiple-choice',
    question: 'What is the index of the first element in an array (in most programming languages)?',
    options: ['0', '1', '-1', 'Depends on array size'],
    answer: 0,
    explanation: 'Most programming languages use 0-based indexing, where the first element is at index 0.',
    timeLimit: 45
  },
  {
    topic: 'Arrays', tier: 'beginner', questionType: 'true-false',
    question: 'Arrays in most languages have a fixed size once created.',
    options: ['True', 'False'],
    answer: 0,
    explanation: 'Traditional arrays have fixed size. Dynamic arrays (like ArrayList, vector) can resize but involve copying.',
    timeLimit: 30
  },
  {
    topic: 'Arrays', tier: 'beginner', questionType: 'code-output',
    question: 'What is the output of this code?',
    codeSnippet: 'arr = [10, 20, 30, 40]\nprint(arr[2])',
    codeLanguage: 'python',
    options: ['10', '20', '30', '40'],
    answer: 2,
    explanation: 'arr[2] accesses the element at index 2, which is 30 (0-indexed).',
    timeLimit: 45
  },

  // Intermediate - Arrays
  {
    topic: 'Arrays', tier: 'intermediate', questionType: 'multiple-choice',
    question: 'What is the time complexity of inserting an element at the beginning of an array?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
    answer: 2,
    explanation: 'Inserting at the beginning requires shifting all existing elements, which takes O(n) time.',
    timeLimit: 60
  },
  {
    topic: 'Arrays', tier: 'intermediate', questionType: 'multiple-choice',
    question: 'Which technique is commonly used to find a pair of elements in a sorted array that sum to a target?',
    options: ['Binary Search', 'Two Pointers', 'BFS', 'Dynamic Programming'],
    answer: 1,
    explanation: 'Two pointers from both ends is efficient O(n) for sorted arrays. Move left pointer up if sum < target, right pointer down if sum > target.',
    timeLimit: 60
  },
  {
    topic: 'Arrays', tier: 'intermediate', questionType: 'code-output',
    question: 'What does this code return?',
    codeSnippet: 'function findMax(arr) {\n  let max = arr[0];\n  for (let i = 1; i < arr.length; i++) {\n    if (arr[i] > max) max = arr[i];\n  }\n  return max;\n}\nconsole.log(findMax([3, 1, 4, 1, 5, 9, 2, 6]));',
    codeLanguage: 'javascript',
    options: ['3', '6', '9', '1'],
    answer: 2,
    explanation: 'The function finds the maximum element in the array, which is 9.',
    timeLimit: 90
  },
  {
    topic: 'Arrays', tier: 'intermediate', questionType: 'multiple-choice',
    question: 'What is the space complexity of an in-place array reversal algorithm?',
    options: ['O(n)', 'O(n²)', 'O(1)', 'O(log n)'],
    answer: 2,
    explanation: 'In-place reversal uses only a constant amount of extra space (for swapping), regardless of array size.',
    timeLimit: 60
  },

  // Advanced - Arrays
  {
    topic: 'Arrays', tier: 'advanced', questionType: 'multiple-choice',
    question: 'In the "Trapping Rain Water" problem, what is the optimal time and space complexity?',
    options: ['O(n) time, O(n) space', 'O(n) time, O(1) space', 'O(n²) time, O(1) space', 'O(n log n) time, O(n) space'],
    answer: 1,
    explanation: 'Using two pointers, we can solve it in O(n) time with O(1) space by tracking left_max and right_max as we go.',
    timeLimit: 90
  },
  {
    topic: 'Arrays', tier: 'advanced', questionType: 'multiple-choice',
    question: 'Which algorithm would you use to find the k-th largest element in an unsorted array optimally?',
    options: ['Sort and index - O(n log n)', 'QuickSelect - O(n) average', 'Binary Search - O(log n)', 'Linear scan k times - O(kn)'],
    answer: 1,
    explanation: 'QuickSelect uses partitioning similar to QuickSort to find k-th element in O(n) average time without fully sorting.',
    timeLimit: 90
  },
  {
    topic: 'Arrays', tier: 'advanced', questionType: 'multiple-choice',
    question: 'What technique is used to solve "Maximum Subarray Sum" (Kadane\'s algorithm)?',
    options: ['Divide and Conquer', 'Dynamic Programming', 'Greedy', 'Backtracking'],
    answer: 1,
    explanation: 'Kadane\'s algorithm uses DP concept: max_ending_here = max(num, max_ending_here + num) at each position.',
    timeLimit: 60
  },

  // Expert - Arrays
  {
    topic: 'Arrays', tier: 'expert', questionType: 'multiple-choice',
    question: 'In the "Median of Two Sorted Arrays" problem (LeetCode Hard), what is the optimal time complexity?',
    options: ['O(n + m)', 'O(n log m)', 'O(log(min(n,m)))', 'O(log(n + m))'],
    answer: 2,
    explanation: 'Using binary search on the smaller array to find the partition point achieves O(log(min(n,m))) complexity.',
    timeLimit: 120
  },
  {
    topic: 'Arrays', tier: 'expert', questionType: 'multiple-choice',
    question: 'Which data structure augments arrays to answer range sum queries in O(log n) with O(log n) updates?',
    options: ['Hash Table', 'Binary Indexed Tree (Fenwick Tree)', 'Trie', 'AVL Tree'],
    answer: 1,
    explanation: 'Fenwick Tree (BIT) supports both point updates and prefix sum queries in O(log n) time.',
    timeLimit: 90
  },

  // ===================== STRINGS =====================
  // Beginner - Strings
  {
    topic: 'Strings', tier: 'beginner', questionType: 'multiple-choice',
    question: 'What is the time complexity of finding the length of a string?',
    options: ['O(1) in most languages', 'O(n) always', 'O(log n)', 'Depends on string content'],
    answer: 0,
    explanation: 'Most languages store string length, making it O(1). In C, strlen() is O(n) as it counts until null terminator.',
    timeLimit: 45
  },
  {
    topic: 'Strings', tier: 'beginner', questionType: 'code-output',
    question: 'What is the output?',
    codeSnippet: 's = "Hello"\nprint(s[1])',
    codeLanguage: 'python',
    options: ['H', 'e', 'l', 'Error'],
    answer: 1,
    explanation: 's[1] accesses the character at index 1, which is \'e\' (0-indexed).',
    timeLimit: 30
  },
  {
    topic: 'Strings', tier: 'beginner', questionType: 'multiple-choice',
    question: 'Are strings mutable or immutable in Python and Java?',
    options: ['Mutable in both', 'Immutable in both', 'Mutable in Python, immutable in Java', 'Immutable in Python, mutable in Java'],
    answer: 1,
    explanation: 'Strings are immutable in both Python and Java. Modifications create new string objects.',
    timeLimit: 45
  },

  // Intermediate - Strings
  {
    topic: 'Strings', tier: 'intermediate', questionType: 'multiple-choice',
    question: 'What is the time complexity of checking if a string is a palindrome?',
    options: ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'],
    answer: 0,
    explanation: 'We compare characters from both ends, meeting in the middle. Each character is checked at most once: O(n).',
    timeLimit: 60
  },
  {
    topic: 'Strings', tier: 'intermediate', questionType: 'multiple-choice',
    question: 'Which approach is best for "Longest Substring Without Repeating Characters"?',
    options: ['Brute Force - check all substrings', 'Sliding Window with HashSet', 'Recursion', 'Binary Search'],
    answer: 1,
    explanation: 'Sliding window with a set tracks unique characters. Expand right, shrink left on duplicate. O(n) time.',
    timeLimit: 75
  },
  {
    topic: 'Strings', tier: 'intermediate', questionType: 'code-output',
    question: 'What does this function return for "racecar"?',
    codeSnippet: 'def is_palindrome(s):\n    return s == s[::-1]\n\nprint(is_palindrome("racecar"))',
    codeLanguage: 'python',
    options: ['True', 'False', 'racecar', 'Error'],
    answer: 0,
    explanation: '"racecar" reversed is still "racecar", so it\'s a palindrome and returns True.',
    timeLimit: 60
  },

  // Advanced - Strings
  {
    topic: 'Strings', tier: 'advanced', questionType: 'multiple-choice',
    question: 'What is the time complexity of the KMP (Knuth-Morris-Pratt) string matching algorithm?',
    options: ['O(n × m)', 'O(n + m)', 'O(n log m)', 'O(n²)'],
    answer: 1,
    explanation: 'KMP preprocesses the pattern in O(m) and searches in O(n), totaling O(n + m) where n is text length, m is pattern length.',
    timeLimit: 90
  },
  {
    topic: 'Strings', tier: 'advanced', questionType: 'multiple-choice',
    question: 'Which technique is used to solve "Longest Palindromic Substring" in O(n) time?',
    options: ['Dynamic Programming', 'Manacher\'s Algorithm', 'KMP', 'Rabin-Karp'],
    answer: 1,
    explanation: 'Manacher\'s Algorithm exploits palindrome symmetry to achieve O(n) time complexity.',
    timeLimit: 90
  },

  // Expert - Strings
  {
    topic: 'Strings', tier: 'expert', questionType: 'multiple-choice',
    question: 'What data structure is used in Aho-Corasick algorithm for multiple pattern matching?',
    options: ['Hash Table', 'Trie with failure links', 'Segment Tree', 'Suffix Array'],
    answer: 1,
    explanation: 'Aho-Corasick builds a trie of all patterns and adds failure links (like KMP) for efficient multi-pattern matching.',
    timeLimit: 120
  },
  {
    topic: 'Strings', tier: 'expert', questionType: 'multiple-choice',
    question: 'What is the time complexity of constructing a Suffix Array using the DC3/Skew algorithm?',
    options: ['O(n²)', 'O(n log n)', 'O(n)', 'O(n log² n)'],
    answer: 2,
    explanation: 'The DC3 (Difference Cover 3) algorithm constructs suffix arrays in linear O(n) time.',
    timeLimit: 120
  },

  // ===================== LINKED LIST =====================
  // Beginner - Linked List
  {
    topic: 'Linked List', tier: 'beginner', questionType: 'multiple-choice',
    question: 'What is the time complexity of accessing an element in a singly linked list?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
    answer: 2,
    explanation: 'Unlike arrays, linked lists require traversal from the head to reach any element, taking O(n) time.',
    timeLimit: 45
  },
  {
    topic: 'Linked List', tier: 'beginner', questionType: 'multiple-choice',
    question: 'What is the time complexity of inserting at the head of a singly linked list?',
    options: ['O(n)', 'O(1)', 'O(log n)', 'O(n²)'],
    answer: 1,
    explanation: 'Inserting at head only requires updating the head pointer and new node\'s next pointer: O(1).',
    timeLimit: 45
  },
  {
    topic: 'Linked List', tier: 'beginner', questionType: 'true-false',
    question: 'A doubly linked list allows traversal in both directions.',
    options: ['True', 'False'],
    answer: 0,
    explanation: 'Doubly linked lists have both next and prev pointers, enabling bidirectional traversal.',
    timeLimit: 30
  },

  // Intermediate - Linked List
  {
    topic: 'Linked List', tier: 'intermediate', questionType: 'multiple-choice',
    question: 'What algorithm is used to detect a cycle in a linked list with O(1) space?',
    options: ['BFS', 'Floyd\'s Tortoise and Hare', 'Hash Table', 'DFS'],
    answer: 1,
    explanation: 'Floyd\'s algorithm uses two pointers (slow and fast). If they meet, there\'s a cycle. O(n) time, O(1) space.',
    timeLimit: 60
  },
  {
    topic: 'Linked List', tier: 'intermediate', questionType: 'multiple-choice',
    question: 'To reverse a singly linked list iteratively, how many pointers do you need?',
    options: ['1', '2', '3', '4'],
    answer: 2,
    explanation: 'You need three pointers: prev (initially null), curr (current node), and next (to save next node before reversing link).',
    timeLimit: 60
  },
  {
    topic: 'Linked List', tier: 'intermediate', questionType: 'code-output',
    question: 'After this operation, what is the new head value?',
    codeSnippet: '// Initial list: 1 -> 2 -> 3 -> 4 -> null\n// After reversing the entire list\n// New list: ? -> ? -> ? -> ? -> null',
    codeLanguage: 'javascript',
    options: ['1', '2', '3', '4'],
    answer: 3,
    explanation: 'After reversing, the list becomes 4 -> 3 -> 2 -> 1 -> null. The new head is 4.',
    timeLimit: 60
  },

  // Advanced - Linked List
  {
    topic: 'Linked List', tier: 'advanced', questionType: 'multiple-choice',
    question: 'What is the time complexity of merging k sorted linked lists using a min-heap?',
    options: ['O(nk)', 'O(n log k)', 'O(nk log k)', 'O(n + k)'],
    answer: 1,
    explanation: 'With a min-heap of size k, each of n total elements is pushed/popped once. Each operation is O(log k), total O(n log k).',
    timeLimit: 90
  },
  {
    topic: 'Linked List', tier: 'advanced', questionType: 'multiple-choice',
    question: 'In "LRU Cache" implementation, which data structures are typically combined?',
    options: ['Array + Stack', 'HashMap + Doubly Linked List', 'Trie + Queue', 'Heap + Array'],
    answer: 1,
    explanation: 'HashMap gives O(1) lookup, doubly linked list gives O(1) insertion/deletion for maintaining access order.',
    timeLimit: 75
  },

  // Expert - Linked List
  {
    topic: 'Linked List', tier: 'expert', questionType: 'multiple-choice',
    question: 'In "Copy List with Random Pointer", what is the optimal space complexity?',
    options: ['O(n) with hash map', 'O(1) with interleaving technique', 'O(n²)', 'O(log n)'],
    answer: 1,
    explanation: 'Interleaving: insert copy after each original node, set random pointers, then separate lists. O(1) extra space.',
    timeLimit: 120
  },

  // ===================== TREES =====================
  // Beginner - Trees
  {
    topic: 'Trees', tier: 'beginner', questionType: 'multiple-choice',
    question: 'What is the maximum number of children a node can have in a binary tree?',
    options: ['1', '2', '3', 'Unlimited'],
    answer: 1,
    explanation: 'By definition, a binary tree node has at most 2 children (left and right).',
    timeLimit: 30
  },
  {
    topic: 'Trees', tier: 'beginner', questionType: 'multiple-choice',
    question: 'What is the depth of the root node in a tree?',
    options: ['0', '1', '-1', 'Depends on tree height'],
    answer: 0,
    explanation: 'By convention, the root node is at depth 0. Depth increases by 1 for each level down.',
    timeLimit: 30
  },
  {
    topic: 'Trees', tier: 'beginner', questionType: 'multiple-choice',
    question: 'In a Binary Search Tree, where are smaller values stored relative to a node?',
    options: ['Left subtree', 'Right subtree', 'Either side', 'Only at leaves'],
    answer: 0,
    explanation: 'In a BST, values less than the node go to the left subtree, greater values go to the right.',
    timeLimit: 45
  },

  // Intermediate - Trees
  {
    topic: 'Trees', tier: 'intermediate', questionType: 'multiple-choice',
    question: 'What traversal of a BST gives elements in sorted order?',
    options: ['Preorder', 'Inorder', 'Postorder', 'Level order'],
    answer: 1,
    explanation: 'Inorder traversal (left, root, right) of a BST visits nodes in ascending order.',
    timeLimit: 45
  },
  {
    topic: 'Trees', tier: 'intermediate', questionType: 'multiple-choice',
    question: 'What is the time complexity of searching in a balanced BST?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
    answer: 1,
    explanation: 'In a balanced BST, height is O(log n), and search follows a root-to-leaf path: O(log n).',
    timeLimit: 60
  },
  {
    topic: 'Trees', tier: 'intermediate', questionType: 'code-output',
    question: 'What is the inorder traversal of this BST?',
    codeSnippet: '      4\n     / \\\n    2   6\n   / \\ / \\\n  1  3 5  7',
    codeLanguage: '',
    options: ['4,2,1,3,6,5,7', '1,2,3,4,5,6,7', '1,3,2,5,7,6,4', '4,2,6,1,3,5,7'],
    answer: 1,
    explanation: 'Inorder (left, root, right) visits: 1, 2, 3, 4, 5, 6, 7 - sorted order for BST.',
    timeLimit: 90
  },

  // Advanced - Trees
  {
    topic: 'Trees', tier: 'advanced', questionType: 'multiple-choice',
    question: 'Which tree balancing technique uses rotations to maintain O(log n) height?',
    options: ['Binary Search Tree', 'AVL Tree', 'Trie', 'Heap'],
    answer: 1,
    explanation: 'AVL trees use rotations (single and double) to maintain balance factor ≤ 1, ensuring O(log n) operations.',
    timeLimit: 75
  },
  {
    topic: 'Trees', tier: 'advanced', questionType: 'multiple-choice',
    question: 'What is the time complexity of finding the Lowest Common Ancestor (LCA) in a BST?',
    options: ['O(n)', 'O(log n) for balanced BST', 'O(n²)', 'O(1)'],
    answer: 1,
    explanation: 'In BST, LCA is found by traversing from root: go left if both < node, right if both > node, else current is LCA. O(h).',
    timeLimit: 90
  },

  // Expert - Trees
  {
    topic: 'Trees', tier: 'expert', questionType: 'multiple-choice',
    question: 'What data structure supports O(log n) range queries and updates on trees?',
    options: ['Binary Search Tree', 'Heavy-Light Decomposition', 'Trie', 'B-Tree'],
    answer: 1,
    explanation: 'Heavy-Light Decomposition breaks tree into chains, enabling segment tree queries on paths in O(log² n).',
    timeLimit: 120
  },
  {
    topic: 'Trees', tier: 'expert', questionType: 'multiple-choice',
    question: 'In a Segment Tree with lazy propagation, what is the purpose of the lazy array?',
    options: ['Store original values', 'Defer updates until needed', 'Track tree height', 'Store parent pointers'],
    answer: 1,
    explanation: 'Lazy propagation defers range updates, applying them only when that segment is accessed, achieving O(log n) range updates.',
    timeLimit: 120
  },

  // ===================== DYNAMIC PROGRAMMING =====================
  // Beginner - DP
  {
    topic: 'Dynamic Programming', tier: 'beginner', questionType: 'multiple-choice',
    question: 'What are the two key properties required for a problem to be solvable by DP?',
    options: ['Sorting and Searching', 'Optimal Substructure and Overlapping Subproblems', 'Recursion and Iteration', 'Divide and Conquer'],
    answer: 1,
    explanation: 'DP requires: 1) Optimal substructure (optimal solution uses optimal sub-solutions), 2) Overlapping subproblems (same subproblems solved multiple times).',
    timeLimit: 60
  },
  {
    topic: 'Dynamic Programming', tier: 'beginner', questionType: 'multiple-choice',
    question: 'What is the time complexity of computing Fibonacci(n) using memoization?',
    options: ['O(2ⁿ)', 'O(n)', 'O(n²)', 'O(log n)'],
    answer: 1,
    explanation: 'With memoization, each Fibonacci number is computed once and cached, giving O(n) time.',
    timeLimit: 60
  },
  {
    topic: 'Dynamic Programming', tier: 'beginner', questionType: 'code-output',
    question: 'What does this DP code compute for n=5?',
    codeSnippet: 'def climb(n):\n    if n <= 2: return n\n    dp = [0] * (n+1)\n    dp[1], dp[2] = 1, 2\n    for i in range(3, n+1):\n        dp[i] = dp[i-1] + dp[i-2]\n    return dp[n]\nprint(climb(5))',
    codeLanguage: 'python',
    options: ['5', '8', '13', '3'],
    answer: 1,
    explanation: 'This is the climbing stairs problem. dp = [0,1,2,3,5,8]. dp[5] = 8 ways to climb 5 stairs.',
    timeLimit: 90
  },

  // Intermediate - DP
  {
    topic: 'Dynamic Programming', tier: 'intermediate', questionType: 'multiple-choice',
    question: 'What is the time complexity of the 0/1 Knapsack problem with DP?',
    options: ['O(n)', 'O(nW) where W is capacity', 'O(2ⁿ)', 'O(n log n)'],
    answer: 1,
    explanation: 'DP table is n items × W capacity. Each cell computed in O(1), total O(nW) pseudo-polynomial time.',
    timeLimit: 75
  },
  {
    topic: 'Dynamic Programming', tier: 'intermediate', questionType: 'multiple-choice',
    question: 'In Longest Common Subsequence (LCS), what is the recurrence when characters match?',
    options: ['dp[i][j] = max(dp[i-1][j], dp[i][j-1])', 'dp[i][j] = dp[i-1][j-1] + 1', 'dp[i][j] = dp[i-1][j-1]', 'dp[i][j] = 0'],
    answer: 1,
    explanation: 'When s1[i] == s2[j], we extend the LCS by 1: dp[i][j] = dp[i-1][j-1] + 1.',
    timeLimit: 75
  },
  {
    topic: 'Dynamic Programming', tier: 'intermediate', questionType: 'multiple-choice',
    question: 'Which approach typically uses less memory: top-down or bottom-up DP?',
    options: ['Top-down always', 'Bottom-up always', 'Bottom-up (can optimize space)', 'They use the same memory'],
    answer: 2,
    explanation: 'Bottom-up often allows space optimization (e.g., using only previous row) since we control iteration order.',
    timeLimit: 60
  },

  // Advanced - DP
  {
    topic: 'Dynamic Programming', tier: 'advanced', questionType: 'multiple-choice',
    question: 'What is the time complexity of Edit Distance (Levenshtein) for strings of length m and n?',
    options: ['O(m + n)', 'O(mn)', 'O(m × n × min(m,n))', 'O(2^(m+n))'],
    answer: 1,
    explanation: 'DP table is m × n. Each cell requires O(1) to compute using adjacent cells. Total: O(mn).',
    timeLimit: 90
  },
  {
    topic: 'Dynamic Programming', tier: 'advanced', questionType: 'multiple-choice',
    question: 'Which DP technique reduces 0/1 Knapsack space from O(nW) to O(W)?',
    options: ['Memoization', 'Using 1D array with reverse iteration', 'Matrix exponentiation', 'Divide and conquer'],
    answer: 1,
    explanation: 'Since dp[i][w] only depends on row i-1, we use 1D array. Iterate w from W to 0 to avoid overwriting needed values.',
    timeLimit: 90
  },

  // Expert - DP
  {
    topic: 'Dynamic Programming', tier: 'expert', questionType: 'multiple-choice',
    question: 'What optimization technique reduces O(n²) DP to O(n log n) using monotonic structures?',
    options: ['Memoization', 'Convex Hull Trick', 'Matrix Chain', 'Floyd-Warshall'],
    answer: 1,
    explanation: 'Convex Hull Trick optimizes DP recurrences of form dp[i] = min(dp[j] + b[j]*a[i]) using a deque of lines.',
    timeLimit: 120
  },
  {
    topic: 'Dynamic Programming', tier: 'expert', questionType: 'multiple-choice',
    question: 'In "Bitmask DP", what does the bitmask typically represent?',
    options: ['Array indices', 'Subset of elements visited/selected', 'Binary tree structure', 'Hash values'],
    answer: 1,
    explanation: 'Bitmask DP uses bits to represent which elements are in current subset. Useful for problems like TSP: O(n² × 2ⁿ).',
    timeLimit: 120
  },

  // ===================== GRAPHS =====================
  // Beginner - Graphs
  {
    topic: 'Graphs', tier: 'beginner', questionType: 'multiple-choice',
    question: 'What is the time complexity of BFS on a graph with V vertices and E edges?',
    options: ['O(V)', 'O(E)', 'O(V + E)', 'O(V × E)'],
    answer: 2,
    explanation: 'BFS visits each vertex once O(V) and explores each edge once O(E), totaling O(V + E).',
    timeLimit: 60
  },
  {
    topic: 'Graphs', tier: 'beginner', questionType: 'multiple-choice',
    question: 'Which data structure is used for BFS traversal?',
    options: ['Stack', 'Queue', 'Heap', 'Tree'],
    answer: 1,
    explanation: 'BFS uses a queue (FIFO) to explore neighbors level by level.',
    timeLimit: 30
  },
  {
    topic: 'Graphs', tier: 'beginner', questionType: 'true-false',
    question: 'DFS can be implemented using recursion.',
    options: ['True', 'False'],
    answer: 0,
    explanation: 'DFS naturally uses the call stack for recursion, or can use an explicit stack for iteration.',
    timeLimit: 30
  },

  // Intermediate - Graphs
  {
    topic: 'Graphs', tier: 'intermediate', questionType: 'multiple-choice',
    question: 'How do you detect a cycle in an undirected graph using DFS?',
    options: ['Check if node is visited', 'Check if visited neighbor is not the parent', 'Count edges', 'Use BFS instead'],
    answer: 1,
    explanation: 'In undirected graphs, if DFS finds a visited neighbor that isn\'t the parent of current node, there\'s a cycle.',
    timeLimit: 75
  },
  {
    topic: 'Graphs', tier: 'intermediate', questionType: 'multiple-choice',
    question: 'What algorithm finds shortest paths from a single source in an unweighted graph?',
    options: ['Dijkstra', 'BFS', 'Bellman-Ford', 'Floyd-Warshall'],
    answer: 1,
    explanation: 'BFS finds shortest paths in unweighted graphs because it explores nodes level by level (by distance).',
    timeLimit: 60
  },
  {
    topic: 'Graphs', tier: 'intermediate', questionType: 'multiple-choice',
    question: 'What is topological sorting used for?',
    options: ['Finding shortest path', 'Ordering tasks with dependencies (DAG)', 'Detecting cycles', 'Finding connected components'],
    answer: 1,
    explanation: 'Topological sort orders vertices so that for every edge u→v, u comes before v. Used for dependency resolution.',
    timeLimit: 60
  },

  // Advanced - Graphs
  {
    topic: 'Graphs', tier: 'advanced', questionType: 'multiple-choice',
    question: 'What is the time complexity of Dijkstra\'s algorithm with a binary heap?',
    options: ['O(V²)', 'O((V + E) log V)', 'O(VE)', 'O(V log E)'],
    answer: 1,
    explanation: 'With binary heap: V extract-min operations O(V log V) + E decrease-key operations O(E log V) = O((V+E) log V).',
    timeLimit: 90
  },
  {
    topic: 'Graphs', tier: 'advanced', questionType: 'multiple-choice',
    question: 'Which algorithm can handle negative edge weights (but no negative cycles)?',
    options: ['Dijkstra', 'BFS', 'Bellman-Ford', 'Prim\'s'],
    answer: 2,
    explanation: 'Bellman-Ford relaxes all edges V-1 times, correctly handling negative weights. Detects negative cycles too.',
    timeLimit: 75
  },

  // Expert - Graphs
  {
    topic: 'Graphs', tier: 'expert', questionType: 'multiple-choice',
    question: 'What is the time complexity of finding Maximum Flow using Ford-Fulkerson with BFS (Edmonds-Karp)?',
    options: ['O(VE)', 'O(VE²)', 'O(V²E)', 'O(V³)'],
    answer: 1,
    explanation: 'Edmonds-Karp runs BFS O(VE) times (each finds augmenting path in O(E)), total O(VE²).',
    timeLimit: 120
  },
  {
    topic: 'Graphs', tier: 'expert', questionType: 'multiple-choice',
    question: 'What does Tarjan\'s algorithm find in a directed graph?',
    options: ['Shortest paths', 'Minimum spanning tree', 'Strongly Connected Components', 'Bipartite matching'],
    answer: 2,
    explanation: 'Tarjan\'s algorithm uses DFS with low-link values to find all SCCs in O(V + E) time.',
    timeLimit: 90
  }
];

// ============================================
// TEST CASES AND CODE TEMPLATES FOR DSA PROBLEMS
// ============================================

// Test cases data - will be linked to questions by matching question text
const dsaTestCasesData = {
  'Two Sum - Find two numbers that add up to a target': {
    testCases: [
      { input: '[2,7,11,15]\n9', expectedOutput: '[0,1]', isSample: true, order: 1, description: 'Basic case with two numbers summing to target' },
      { input: '[3,2,4]\n6', expectedOutput: '[1,2]', isSample: true, order: 2, description: 'Numbers not at beginning' },
      { input: '[3,3]\n6', expectedOutput: '[0,1]', isSample: false, order: 3, description: 'Duplicate numbers' },
      { input: '[1,2,3,4,5,6,7,8,9,10]\n19', expectedOutput: '[8,9]', isHidden: true, order: 4, description: 'Larger array' },
      { input: '[-1,-2,-3,-4,-5]\n-8', expectedOutput: '[2,4]', isHidden: true, order: 5, description: 'Negative numbers', isEdgeCase: true, edgeCaseType: 'negative' }
    ],
    template: {
      inputFormat: 'Line 1: Array of integers\\nLine 2: Target sum',
      outputFormat: 'Array of two indices',
      constraints: [{ description: 'Array length', value: '2 <= nums.length <= 10^4' }, { description: 'Number range', value: '-10^9 <= nums[i] <= 10^9' }],
      templates: {
        python: { code: 'def twoSum(nums, target):\n    # Your code here\n    pass\n\n# Read input\nnums = eval(input())\ntarget = int(input())\nprint(twoSum(nums, target))', functionName: 'twoSum' },
        javascript: { code: 'function twoSum(nums, target) {\n    // Your code here\n}\n\n// Read input\nconst readline = require("readline");\nconst rl = readline.createInterface({ input: process.stdin });\nconst lines = [];\nrl.on("line", (line) => lines.push(line));\nrl.on("close", () => {\n    const nums = JSON.parse(lines[0]);\n    const target = parseInt(lines[1]);\n    console.log(JSON.stringify(twoSum(nums, target)));\n});', functionName: 'twoSum' },
        java: { code: 'import java.util.*;\n\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Your code here\n        return new int[]{};\n    }\n    \n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String line = sc.nextLine();\n        int target = sc.nextInt();\n        // Parse and call solution\n    }\n}', functionName: 'twoSum', className: 'Solution' },
        cpp: { code: '#include <bits/stdc++.h>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    // Your code here\n    return {};\n}\n\nint main() {\n    // Read input and call function\n    return 0;\n}', functionName: 'twoSum', includes: '#include <bits/stdc++.h>' }
      }
    }
  },
  'Find the maximum element in an array': {
    testCases: [
      { input: '[3,1,4,1,5,9,2,6]', expectedOutput: '9', isSample: true, order: 1, description: 'Array with multiple elements' },
      { input: '[1]', expectedOutput: '1', isSample: true, order: 2, description: 'Single element', isEdgeCase: true, edgeCaseType: 'single-element' },
      { input: '[-5,-2,-10,-1]', expectedOutput: '-1', isSample: false, order: 3, description: 'All negative numbers', isEdgeCase: true, edgeCaseType: 'negative' },
      { input: '[100,100,100]', expectedOutput: '100', isHidden: true, order: 4, description: 'All same elements' },
      { input: '[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]', expectedOutput: '20', isHidden: true, order: 5, description: 'Larger array' }
    ],
    template: {
      inputFormat: 'Array of integers',
      outputFormat: 'Single integer (maximum value)',
      constraints: [{ description: 'Array length', value: '1 <= nums.length <= 10^5' }],
      templates: {
        python: { code: 'def findMax(nums):\n    # Your code here\n    pass\n\nnums = eval(input())\nprint(findMax(nums))', functionName: 'findMax' },
        javascript: { code: 'function findMax(nums) {\n    // Your code here\n}\n\nconst readline = require("readline");\nconst rl = readline.createInterface({ input: process.stdin });\nrl.on("line", (line) => {\n    const nums = JSON.parse(line);\n    console.log(findMax(nums));\n    rl.close();\n});', functionName: 'findMax' }
      }
    }
  },
  'Container With Most Water': {
    testCases: [
      { input: '[1,8,6,2,5,4,8,3,7]', expectedOutput: '49', isSample: true, order: 1, description: 'Standard case' },
      { input: '[1,1]', expectedOutput: '1', isSample: true, order: 2, description: 'Minimum array size', isEdgeCase: true, edgeCaseType: 'boundary' },
      { input: '[4,3,2,1,4]', expectedOutput: '16', isSample: false, order: 3, description: 'Symmetric heights' },
      { input: '[1,2,1]', expectedOutput: '2', isHidden: true, order: 4, description: 'Small array' },
      { input: '[1,8,6,2,5,4,8,25,7]', expectedOutput: '49', isHidden: true, order: 5, description: 'With taller bar' }
    ],
    template: {
      inputFormat: 'Array of heights',
      outputFormat: 'Maximum water area (integer)',
      constraints: [{ description: 'Array length', value: '2 <= height.length <= 10^5' }, { description: 'Height range', value: '0 <= height[i] <= 10^4' }],
      templates: {
        python: { code: 'def maxArea(height):\n    # Your code here\n    pass\n\nheight = eval(input())\nprint(maxArea(height))', functionName: 'maxArea' },
        javascript: { code: 'function maxArea(height) {\n    // Your code here\n}\n\nconst readline = require("readline");\nconst rl = readline.createInterface({ input: process.stdin });\nrl.on("line", (line) => {\n    const height = JSON.parse(line);\n    console.log(maxArea(height));\n    rl.close();\n});', functionName: 'maxArea' }
      }
    }
  },
  'Rotate Array by K positions': {
    testCases: [
      { input: '[1,2,3,4,5,6,7]\n3', expectedOutput: '[5,6,7,1,2,3,4]', isSample: true, order: 1, description: 'Standard rotation' },
      { input: '[-1,-100,3,99]\n2', expectedOutput: '[3,99,-1,-100]', isSample: true, order: 2, description: 'With negative numbers' },
      { input: '[1,2,3]\n4', expectedOutput: '[3,1,2]', isSample: false, order: 3, description: 'K larger than array length' },
      { input: '[1]\n0', expectedOutput: '[1]', isHidden: true, order: 4, description: 'Single element, no rotation', isEdgeCase: true, edgeCaseType: 'single-element' },
      { input: '[1,2]\n3', expectedOutput: '[2,1]', isHidden: true, order: 5, description: 'K larger than length' }
    ],
    template: {
      inputFormat: 'Line 1: Array of integers\\nLine 2: K (rotation count)',
      outputFormat: 'Rotated array',
      constraints: [{ description: 'Array length', value: '1 <= nums.length <= 10^5' }, { description: 'K range', value: '0 <= k <= 10^5' }],
      templates: {
        python: { code: 'def rotate(nums, k):\n    # Your code here (modify in-place)\n    pass\n\nnums = eval(input())\nk = int(input())\nrotate(nums, k)\nprint(nums)', functionName: 'rotate' },
        javascript: { code: 'function rotate(nums, k) {\n    // Your code here (modify in-place)\n}\n\nconst readline = require("readline");\nconst rl = readline.createInterface({ input: process.stdin });\nconst lines = [];\nrl.on("line", (line) => lines.push(line));\nrl.on("close", () => {\n    const nums = JSON.parse(lines[0]);\n    const k = parseInt(lines[1]);\n    rotate(nums, k);\n    console.log(JSON.stringify(nums));\n});', functionName: 'rotate' }
      }
    }
  },
  'Trapping Rain Water': {
    testCases: [
      { input: '[0,1,0,2,1,0,1,3,2,1,2,1]', expectedOutput: '6', isSample: true, order: 1, description: 'Standard case' },
      { input: '[4,2,0,3,2,5]', expectedOutput: '9', isSample: true, order: 2, description: 'Valley in middle' },
      { input: '[1,2,3,4,5]', expectedOutput: '0', isSample: false, order: 3, description: 'Increasing heights (no water)' },
      { input: '[5,4,3,2,1]', expectedOutput: '0', isHidden: true, order: 4, description: 'Decreasing heights (no water)' },
      { input: '[0,0,0,0]', expectedOutput: '0', isHidden: true, order: 5, description: 'All zeros', isEdgeCase: true, edgeCaseType: 'empty-input' }
    ],
    template: {
      inputFormat: 'Array of heights (non-negative integers)',
      outputFormat: 'Total water trapped (integer)',
      constraints: [{ description: 'Array length', value: 'n == height.length' }, { description: 'Range', value: '1 <= n <= 2 * 10^4' }],
      templates: {
        python: { code: 'def trap(height):\n    # Your code here\n    pass\n\nheight = eval(input())\nprint(trap(height))', functionName: 'trap' },
        javascript: { code: 'function trap(height) {\n    // Your code here\n}\n\nconst readline = require("readline");\nconst rl = readline.createInterface({ input: process.stdin });\nrl.on("line", (line) => {\n    const height = JSON.parse(line);\n    console.log(trap(height));\n    rl.close();\n});', functionName: 'trap' }
      }
    }
  },
  'Reverse a String': {
    testCases: [
      { input: 'hello', expectedOutput: 'olleh', isSample: true, order: 1, description: 'Simple word' },
      { input: 'Hannah', expectedOutput: 'hannaH', isSample: true, order: 2, description: 'Mixed case' },
      { input: 'a', expectedOutput: 'a', isSample: false, order: 3, description: 'Single character', isEdgeCase: true, edgeCaseType: 'single-element' },
      { input: 'ab', expectedOutput: 'ba', isHidden: true, order: 4, description: 'Two characters' },
      { input: '12345', expectedOutput: '54321', isHidden: true, order: 5, description: 'Numeric string' }
    ],
    template: {
      inputFormat: 'A string',
      outputFormat: 'Reversed string',
      constraints: [{ description: 'String length', value: '1 <= s.length <= 10^5' }],
      templates: {
        python: { code: 'def reverseString(s):\n    # Your code here\n    pass\n\ns = input()\nprint(reverseString(s))', functionName: 'reverseString' },
        javascript: { code: 'function reverseString(s) {\n    // Your code here\n}\n\nconst readline = require("readline");\nconst rl = readline.createInterface({ input: process.stdin });\nrl.on("line", (line) => {\n    console.log(reverseString(line));\n    rl.close();\n});', functionName: 'reverseString' }
      }
    }
  },
  'Check if a string is a palindrome': {
    testCases: [
      { input: 'racecar', expectedOutput: 'true', isSample: true, order: 1, description: 'Palindrome' },
      { input: 'hello', expectedOutput: 'false', isSample: true, order: 2, description: 'Not a palindrome' },
      { input: 'a', expectedOutput: 'true', isSample: false, order: 3, description: 'Single character', isEdgeCase: true, edgeCaseType: 'single-element' },
      { input: 'abba', expectedOutput: 'true', isHidden: true, order: 4, description: 'Even length palindrome' },
      { input: 'ab', expectedOutput: 'false', isHidden: true, order: 5, description: 'Two different characters' }
    ],
    template: {
      inputFormat: 'A string',
      outputFormat: 'true or false',
      constraints: [{ description: 'String length', value: '1 <= s.length <= 10^5' }],
      templates: {
        python: { code: 'def isPalindrome(s):\n    # Your code here\n    pass\n\ns = input()\nprint("true" if isPalindrome(s) else "false")', functionName: 'isPalindrome' },
        javascript: { code: 'function isPalindrome(s) {\n    // Your code here\n}\n\nconst readline = require("readline");\nconst rl = readline.createInterface({ input: process.stdin });\nrl.on("line", (line) => {\n    console.log(isPalindrome(line) ? "true" : "false");\n    rl.close();\n});', functionName: 'isPalindrome' }
      }
    }
  },
  'Longest Substring Without Repeating Characters': {
    testCases: [
      { input: 'abcabcbb', expectedOutput: '3', isSample: true, order: 1, description: 'Standard case (abc)' },
      { input: 'bbbbb', expectedOutput: '1', isSample: true, order: 2, description: 'All same characters' },
      { input: 'pwwkew', expectedOutput: '3', isSample: true, order: 3, description: 'wke is longest' },
      { input: '(empty)', expectedOutput: '0', isHidden: true, order: 4, description: 'Empty string - use empty input', isEdgeCase: true, edgeCaseType: 'empty-input' },
      { input: 'abcdefghijklmnop', expectedOutput: '16', isHidden: true, order: 5, description: 'All unique characters' }
    ],
    template: {
      inputFormat: 'A string',
      outputFormat: 'Length of longest substring without repeating characters',
      constraints: [{ description: 'String length', value: '0 <= s.length <= 5 * 10^4' }],
      templates: {
        python: { code: 'def lengthOfLongestSubstring(s):\n    # Your code here\n    pass\n\ns = input()\nprint(lengthOfLongestSubstring(s))', functionName: 'lengthOfLongestSubstring' },
        javascript: { code: 'function lengthOfLongestSubstring(s) {\n    // Your code here\n}\n\nconst readline = require("readline");\nconst rl = readline.createInterface({ input: process.stdin });\nrl.on("line", (line) => {\n    console.log(lengthOfLongestSubstring(line));\n    rl.close();\n});', functionName: 'lengthOfLongestSubstring' }
      }
    }
  },
  'Valid Parentheses - Check balanced brackets': {
    testCases: [
      { input: '()', expectedOutput: 'true', isSample: true, order: 1, description: 'Simple valid' },
      { input: '()[]{}', expectedOutput: 'true', isSample: true, order: 2, description: 'Multiple types' },
      { input: '(]', expectedOutput: 'false', isSample: true, order: 3, description: 'Mismatched types' },
      { input: '([)]', expectedOutput: 'false', isHidden: true, order: 4, description: 'Interleaved invalid' },
      { input: '{[]}', expectedOutput: 'true', isHidden: true, order: 5, description: 'Nested valid' },
      { input: '(empty)', expectedOutput: 'true', isHidden: true, order: 6, description: 'Empty string - use empty input', isEdgeCase: true, edgeCaseType: 'empty-input' }
    ],
    template: {
      inputFormat: 'A string containing only ()[]{}',
      outputFormat: 'true or false',
      constraints: [{ description: 'String length', value: '0 <= s.length <= 10^4' }],
      templates: {
        python: { code: 'def isValid(s):\n    # Your code here\n    pass\n\ns = input()\nprint("true" if isValid(s) else "false")', functionName: 'isValid' },
        javascript: { code: 'function isValid(s) {\n    // Your code here\n}\n\nconst readline = require("readline");\nconst rl = readline.createInterface({ input: process.stdin });\nrl.on("line", (line) => {\n    console.log(isValid(line) ? "true" : "false");\n    rl.close();\n});', functionName: 'isValid' }
      }
    }
  },
  'Climbing Stairs - Count ways to reach nth step': {
    testCases: [
      { input: '2', expectedOutput: '2', isSample: true, order: 1, description: 'Two steps: 1+1 or 2' },
      { input: '3', expectedOutput: '3', isSample: true, order: 2, description: 'Three steps: 1+1+1, 1+2, 2+1' },
      { input: '1', expectedOutput: '1', isSample: false, order: 3, description: 'Single step', isEdgeCase: true, edgeCaseType: 'single-element' },
      { input: '5', expectedOutput: '8', isHidden: true, order: 4, description: 'Five steps' },
      { input: '10', expectedOutput: '89', isHidden: true, order: 5, description: 'Ten steps' }
    ],
    template: {
      inputFormat: 'An integer n (number of steps)',
      outputFormat: 'Number of distinct ways to climb',
      constraints: [{ description: 'Step count', value: '1 <= n <= 45' }],
      templates: {
        python: { code: 'def climbStairs(n):\n    # Your code here\n    pass\n\nn = int(input())\nprint(climbStairs(n))', functionName: 'climbStairs' },
        javascript: { code: 'function climbStairs(n) {\n    // Your code here\n}\n\nconst readline = require("readline");\nconst rl = readline.createInterface({ input: process.stdin });\nrl.on("line", (line) => {\n    console.log(climbStairs(parseInt(line)));\n    rl.close();\n});', functionName: 'climbStairs' }
      }
    }
  },
  'Maximum Subarray Sum (Kadane\'s Algorithm)': {
    testCases: [
      { input: '[-2,1,-3,4,-1,2,1,-5,4]', expectedOutput: '6', isSample: true, order: 1, description: 'Standard case [4,-1,2,1]' },
      { input: '[1]', expectedOutput: '1', isSample: true, order: 2, description: 'Single element', isEdgeCase: true, edgeCaseType: 'single-element' },
      { input: '[5,4,-1,7,8]', expectedOutput: '23', isSample: false, order: 3, description: 'Entire array is max' },
      { input: '[-1]', expectedOutput: '-1', isHidden: true, order: 4, description: 'Single negative', isEdgeCase: true, edgeCaseType: 'negative' },
      { input: '[-2,-1,-3,-4]', expectedOutput: '-1', isHidden: true, order: 5, description: 'All negatives', isEdgeCase: true, edgeCaseType: 'negative' }
    ],
    template: {
      inputFormat: 'Array of integers',
      outputFormat: 'Maximum subarray sum',
      constraints: [{ description: 'Array length', value: '1 <= nums.length <= 10^5' }],
      templates: {
        python: { code: 'def maxSubArray(nums):\n    # Your code here\n    pass\n\nnums = eval(input())\nprint(maxSubArray(nums))', functionName: 'maxSubArray' },
        javascript: { code: 'function maxSubArray(nums) {\n    // Your code here\n}\n\nconst readline = require("readline");\nconst rl = readline.createInterface({ input: process.stdin });\nrl.on("line", (line) => {\n    console.log(maxSubArray(JSON.parse(line)));\n    rl.close();\n});', functionName: 'maxSubArray' }
      }
    }
  },
  'Maximum Depth of Binary Tree': {
    testCases: [
      { input: '[3,9,20,null,null,15,7]', expectedOutput: '3', isSample: true, order: 1, description: 'Standard tree depth 3' },
      { input: '[1,null,2]', expectedOutput: '2', isSample: true, order: 2, description: 'Skewed tree' },
      { input: '[]', expectedOutput: '0', isSample: false, order: 3, description: 'Empty tree', isEdgeCase: true, edgeCaseType: 'empty-input' },
      { input: '[1]', expectedOutput: '1', isHidden: true, order: 4, description: 'Single node', isEdgeCase: true, edgeCaseType: 'single-element' },
      { input: '[1,2,3,4,5,6,7]', expectedOutput: '3', isHidden: true, order: 5, description: 'Complete binary tree' }
    ],
    template: {
      inputFormat: 'Level-order array representation of binary tree (null for missing nodes)',
      outputFormat: 'Maximum depth (integer)',
      constraints: [{ description: 'Node count', value: '0 <= number of nodes <= 10^4' }],
      templates: {
        python: { code: '# Definition for a binary tree node\nclass TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\ndef maxDepth(root):\n    # Your code here\n    pass\n\n# Input parsing handled by judge', functionName: 'maxDepth' },
        javascript: { code: '// Definition for a binary tree node\nfunction TreeNode(val, left, right) {\n    this.val = (val===undefined ? 0 : val);\n    this.left = (left===undefined ? null : left);\n    this.right = (right===undefined ? null : right);\n}\n\nfunction maxDepth(root) {\n    // Your code here\n}\n\n// Input parsing handled by judge', functionName: 'maxDepth' }
      }
    }
  },
  'Number of Islands': {
    testCases: [
      { input: '[["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', expectedOutput: '1', isSample: true, order: 1, description: 'Single island' },
      { input: '[["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', expectedOutput: '3', isSample: true, order: 2, description: 'Multiple islands' },
      { input: '[["0"]]', expectedOutput: '0', isSample: false, order: 3, description: 'No islands', isEdgeCase: true, edgeCaseType: 'empty-input' },
      { input: '[["1"]]', expectedOutput: '1', isHidden: true, order: 4, description: 'Single cell island', isEdgeCase: true, edgeCaseType: 'single-element' },
      { input: '[["1","0","1","0","1"],["0","1","0","1","0"],["1","0","1","0","1"]]', expectedOutput: '8', isHidden: true, order: 5, description: 'Checkerboard pattern' }
    ],
    template: {
      inputFormat: '2D grid of "1"s (land) and "0"s (water)',
      outputFormat: 'Number of islands (integer)',
      constraints: [{ description: 'Grid size', value: 'm == grid.length, n == grid[i].length' }, { description: 'Dimensions', value: '1 <= m, n <= 300' }],
      templates: {
        python: { code: 'def numIslands(grid):\n    # Your code here\n    pass\n\ngrid = eval(input())\nprint(numIslands(grid))', functionName: 'numIslands' },
        javascript: { code: 'function numIslands(grid) {\n    // Your code here\n}\n\nconst readline = require("readline");\nconst rl = readline.createInterface({ input: process.stdin });\nrl.on("line", (line) => {\n    console.log(numIslands(JSON.parse(line)));\n    rl.close();\n});', functionName: 'numIslands' }
      }
    }
  }
};

const seedDB = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Question.deleteMany({});
    await Company.deleteMany({});
    await SurveyQuestion.deleteMany({});
    await TestCase.deleteMany({});
    await CodeTemplate.deleteMany({});
    console.log('Cleared existing questions, companies, survey questions, test cases, and code templates');

    // Seed aptitude questions
    await Question.insertMany(aptitudeQuestions);
    console.log(`Seeded ${aptitudeQuestions.length} aptitude questions`);

    // Seed DSA questions
    const insertedDsaQuestions = await Question.insertMany(dsaQuestions);
    console.log(`Seeded ${dsaQuestions.length} DSA questions`);

    // Seed HR questions
    await Question.insertMany(hrQuestions);
    console.log(`Seeded ${hrQuestions.length} HR questions`);

    // Seed companies
    await Company.insertMany(companies);
    console.log(`Seeded ${companies.length} companies`);

    // Seed survey questions
    await SurveyQuestion.insertMany(surveyQuestions);
    console.log(`Seeded ${surveyQuestions.length} survey questions`);

    // Seed test cases and code templates for DSA questions
    let testCaseCount = 0;
    let templateCount = 0;

    for (const dsaQ of insertedDsaQuestions) {
      const testData = dsaTestCasesData[dsaQ.question];
      if (testData) {
        // Insert test cases
        if (testData.testCases && testData.testCases.length > 0) {
          const testCasesToInsert = testData.testCases.map(tc => ({
            questionId: dsaQ._id,
            ...tc
          }));
          await TestCase.insertMany(testCasesToInsert);
          testCaseCount += testCasesToInsert.length;
        }

        // Insert code template
        if (testData.template) {
          await CodeTemplate.create({
            questionId: dsaQ._id,
            inputFormat: testData.template.inputFormat || '',
            outputFormat: testData.template.outputFormat || '',
            constraints: testData.template.constraints || [],
            templates: testData.template.templates || {}
          });
          templateCount++;
        }
      }
    }

    console.log(`Seeded ${testCaseCount} test cases for DSA problems`);
    console.log(`Seeded ${templateCount} code templates for DSA problems`);

    console.log('\nSeed complete!');
    console.log(`Total questions: ${aptitudeQuestions.length + dsaQuestions.length + hrQuestions.length}`);
    console.log(`Survey questions: ${surveyQuestions.length}`);
    console.log(`Test cases: ${testCaseCount}`);
    console.log(`Code templates: ${templateCount}`);

    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seedDB();
