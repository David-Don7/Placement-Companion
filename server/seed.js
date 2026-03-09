const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Question = require('./models/Question');
const Company = require('./models/Company');

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

const seedDB = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Question.deleteMany({});
    await Company.deleteMany({});
    console.log('Cleared existing questions and companies');

    // Seed aptitude questions
    await Question.insertMany(aptitudeQuestions);
    console.log(`Seeded ${aptitudeQuestions.length} aptitude questions`);

    // Seed DSA questions
    await Question.insertMany(dsaQuestions);
    console.log(`Seeded ${dsaQuestions.length} DSA questions`);

    // Seed HR questions
    await Question.insertMany(hrQuestions);
    console.log(`Seeded ${hrQuestions.length} HR questions`);

    // Seed companies
    await Company.insertMany(companies);
    console.log(`Seeded ${companies.length} companies`);

    console.log('\nSeed complete!');
    console.log(`Total questions: ${aptitudeQuestions.length + dsaQuestions.length + hrQuestions.length}`);

    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seedDB();
