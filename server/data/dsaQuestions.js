/**
 * DSA & Coding Problems Seed Data
 * This data can be inserted into the database to populate coding questions
 */

const dsaQuestions = [
  // ===== ARRAYS =====
  {
    title: 'Two Sum',
    description: 'Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target. You may assume that each input has exactly one solution, and you may not use the same element twice.',
    difficulty: 'Easy',
    topic: 'Arrays',
    constraints: [
      '2 <= nums.length <= 104',
      '-109 <= nums[i] <= 109',
      '-109 <= target <= 109',
      'Only one valid answer exists.'
    ],
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'nums[0] + nums[1] == 9, so we return [0, 1].'
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]',
        explanation: 'nums[1] + nums[2] == 6, so we return [1, 2].'
      }
    ],
    testCases: [
      { input: '[2,7,11,15]\n9', expectedOutput: '[0,1]', hidden: false },
      { input: '[3,2,4]\n6', expectedOutput: '[1,2]', hidden: false },
      { input: '[-1,-2,-3]\n-5', expectedOutput: '[0,1]', hidden: true }
    ],
    boilerplate: {
      c: '// Input: int* nums, int numsSize, int target\n// Output: int* (indices)\n\nint* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n    // Your code here\n    *returnSize = 2;\n    return nums;  // Replace with actual result\n}',
      cpp: '// Input: vector<int>& nums, int target\n// Output: vector<int>\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    // Your code here\n    vector<int> result;\n    return result;\n}',
      java: '// Input: int[] nums, int target\n// Output: int[]\n\npublic int[] twoSum(int[] nums, int target) {\n    // Your code here\n    return new int[2];\n}'
    },
    hints: [
      'Try using a hash map to store the numbers you have seen so far.',
      'For each number, check if target - number exists in the hash map.'
    ],
    editorial: 'Use a hash map to store values and their indices. For each number, check if (target - number) exists in the map.',
    supportedLanguages: ['C', 'C++', 'Java']
  },

  {
    title: 'Reverse Array',
    description: 'Write a function to reverse an array in-place. You must modify the array in-place with O(1) extra space.',
    difficulty: 'Easy',
    topic: 'Arrays',
    constraints: [
      '1 <= arr.length <= 105',
      '1 <= arr[i] <= 104'
    ],
    examples: [
      {
        input: '[1,2,3,4,5]',
        output: '[5,4,3,2,1]',
        explanation: 'Array reversed in-place'
      }
    ],
    testCases: [
      { input: '[1,2,3,4,5]', expectedOutput: '[5,4,3,2,1]', hidden: false },
      { input: '[1,2]', expectedOutput: '[2,1]', hidden: true }
    ],
    boilerplate: {
      c: 'void reverseArray(int* arr, int n) {\n    // Your code here\n}',
      cpp: 'void reverseArray(vector<int>& arr) {\n    // Your code here\n}',
      java: 'public void reverseArray(int[] arr) {\n    // Your code here\n}'
    },
    hints: ['Use two pointers: one at start, one at end'],
    supportedLanguages: ['C', 'C++', 'Java']
  },

  // ===== STRINGS =====
  {
    title: 'Palindrome Check',
    description: 'Given a string s, determine if it is a palindrome, considering only alphanumeric characters and ignoring cases. Return true if it is a palindrome, false otherwise.',
    difficulty: 'Easy',
    topic: 'Strings',
    constraints: [
      '1 <= s.length <= 2 * 105',
      's consists of printable ASCII characters'
    ],
    examples: [
      {
        input: 's = "A man, a plan, a canal: Panama"',
        output: 'true',
        explanation: 'After cleaning: "amanaplanacanalpanama" is a palindrome'
      }
    ],
    testCases: [
      { input: 'A man, a plan, a canal: Panama', expectedOutput: 'true', hidden: false },
      { input: 'race a car', expectedOutput: 'false', hidden: false }
    ],
    boilerplate: {
      c: 'bool isPalindrome(char* s) {\n    // Your code here\n    return true;\n}',
      cpp: 'bool isPalindrome(string s) {\n    // Your code here\n    return true;\n}',
      java: 'public boolean isPalindrome(String s) {\n    // Your code here\n    return true;\n}'
    },
    hints: ['Use two pointers and clean alphanumeric characters only'],
    supportedLanguages: ['C', 'C++', 'Java']
  },

  // ===== RECURSION =====
  {
    title: 'Factorial',
    description: 'Write a recursive function to calculate the factorial of a non-negative integer n.',
    difficulty: 'Easy',
    topic: 'Recursion',
    constraints: [
      '0 <= n <= 20'
    ],
    examples: [
      {
        input: 'n = 5',
        output: '120',
        explanation: '5! = 5 * 4 * 3 * 2 * 1 = 120'
      }
    ],
    testCases: [
      { input: '5', expectedOutput: '120', hidden: false },
      { input: '0', expectedOutput: '1', hidden: false }
    ],
    boilerplate: {
      c: 'int factorial(int n) {\n    // Your code here\n    return 0;\n}',
      cpp: 'int factorial(int n) {\n    // Your code here\n    return 0;\n}',
      java: 'public int factorial(int n) {\n    // Your code here\n    return 0;\n}'
    },
    hints: ['Base case: factorial(0) = 1', 'Recursive case: factorial(n) = n * factorial(n-1)'],
    supportedLanguages: ['C', 'C++', 'Java']
  },

  // ===== SORTING =====
  {
    title: 'Bubble Sort',
    description: 'Implement bubble sort algorithm to sort an array in ascending order.',
    difficulty: 'Medium',
    topic: 'Sorting',
    constraints: [
      '1 <= arr.length <= 1000'
    ],
    examples: [
      {
        input: '[64, 34, 25, 12, 22, 11, 90]',
        output: '[11, 12, 22, 25, 34, 64, 90]',
        explanation: 'Array sorted in ascending order'
      }
    ],
    testCases: [
      { input: '[64,34,25,12,22,11,90]', expectedOutput: '[11,12,22,25,34,64,90]', hidden: false },
      { input: '[1,2,3]', expectedOutput: '[1,2,3]', hidden: true }
    ],
    boilerplate: {
      c: 'void bubbleSort(int* arr, int n) {\n    // Your code here\n}',
      cpp: 'void bubbleSort(vector<int>& arr) {\n    // Your code here\n}',
      java: 'public void bubbleSort(int[] arr) {\n    // Your code here\n}'
    },
    hints: ['Compare adjacent elements', 'Swap if they are in wrong order'],
    supportedLanguages: ['C', 'C++', 'Java']
  },

  // ===== SEARCHING =====
  {
    title: 'Binary Search',
    description: 'Given a sorted array nums of n elements and a target value target, write a function to search target in nums. Return its index if found, otherwise return -1.',
    difficulty: 'Medium',
    topic: 'Searching',
    constraints: [
      '1 <= nums.length <= 10000',
      'nums is sorted in ascending order',
      '-10000 <= target <= 10000'
    ],
    examples: [
      {
        input: 'nums = [-1,0,3,5,9,12], target = 9',
        output: '4',
        explanation: 'Target found at index 4'
      }
    ],
    testCases: [
      { input: '[-1,0,3,5,9,12]\n9', expectedOutput: '4', hidden: false },
      { input: '[-1,0,3,5,9,12]\n13', expectedOutput: '-1', hidden: false }
    ],
    boilerplate: {
      c: 'int binarySearch(int* nums, int numsSize, int target) {\n    // Your code here\n    return -1;\n}',
      cpp: 'int binarySearch(vector<int>& nums, int target) {\n    // Your code here\n    return -1;\n}',
      java: 'public int binarySearch(int[] nums, int target) {\n    // Your code here\n    return -1;\n}'
    },
    hints: ['Use divide and conquer approach', 'Eliminate half of remaining elements in each iteration'],
    supportedLanguages: ['C', 'C++', 'Java']
  },

  // === LINKED LIST ===
  {
    title: 'Reverse Linked List',
    description: 'Given the head of a singly linked list, reverse the list and return the reversed list.',
    difficulty: 'Medium',
    topic: 'Linked List',
    constraints: [
      'The number of nodes in the list is in range [0, 5000]'
    ],
    examples: [
      {
        input: '1->2->3->4->5->NULL',
        output: '5->4->3->2->1->NULL',
        explanation: 'Linked list reversed'
      }
    ],
    testCases: [
      { input: '[1,2,3,4,5]', expectedOutput: '[5,4,3,2,1]', hidden: false },
      { input: '[]', expectedOutput: '[]', hidden: true }
    ],
    boilerplate: {
      c: 'struct ListNode* reverseList(struct ListNode* head) {\n    // Your code here\n    return head;\n}',
      cpp: 'ListNode* reverseList(ListNode* head) {\n    // Your code here\n    return head;\n}',
      java: 'public ListNode reverseList(ListNode head) {\n    // Your code here\n    return head;\n}'
    },
    hints: ['Use iterative or recursive approach', 'Keep track of previous node'],
    supportedLanguages: ['C', 'C++', 'Java']
  },

  // === STACK ===
  {
    title: 'Valid Parentheses',
    description: 'Given a string s containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid. An input string is valid if all brackets are closed in the correct order.',
    difficulty: 'Easy',
    topic: 'Stack',
    constraints: [
      '1 <= s.length <= 10^4'
    ],
    examples: [
      {
        input: 's = "()"',
        output: 'true',
        explanation: 'Valid parentheses'
      },
      {
        input: 's = "([)]"',
        output: 'false',
        explanation: 'Brackets not in correct order'
      }
    ],
    testCases: [
      { input: '()', expectedOutput: 'true', hidden: false },
      { input: '([)]', expectedOutput: 'false', hidden: false }
    ],
    boilerplate: {
      c: 'bool isValid(char* s) {\n    // Your code here\n    return true;\n}',
      cpp: 'bool isValid(string s) {\n    // Your code here\n    return true;\n}',
      java: 'public boolean isValid(String s) {\n    // Your code here\n    return true;\n}'
    },
    hints: ['Use a stack', 'Push opening brackets, pop and verify closing brackets'],
    supportedLanguages: ['C', 'C++', 'Java']
  },

  // === DYNAMIC PROGRAMMING ===
  {
    title: 'Fibonacci Number',
    description: 'The Fibonacci numbers, commonly denoted F(n) form a sequence in which each number is the sum of the two preceding ones. Given n, calculate F(n).',
    difficulty: 'Easy',
    topic: 'Dynamic Programming',
    constraints: [
      '0 <= n <= 30'
    ],
    examples: [
      {
        input: 'n = 3',
        output: '2',
        explanation: 'F(3) = F(2) + F(1) = 1 + 1 = 2'
      }
    ],
    testCases: [
      { input: '3', expectedOutput: '2', hidden: false },
      { input: '5', expectedOutput: '5', hidden: false }
    ],
    boilerplate: {
      c: 'int fib(int n) {\n    // Your code here\n    return 0;\n}',
      cpp: 'int fib(int n) {\n    // Your code here\n    return 0;\n}',
      java: 'public int fib(int n) {\n    // Your code here\n    return 0;\n}'
    },
    hints: ['Use memoization or tabulation', 'Avoid recalculating same subproblems'],
    supportedLanguages: ['C', 'C++', 'Java']
  },

  // === HARD PROBLEMS ===
  {
    title: 'Longest Increasing Subsequence',
    description: 'Given an integer array nums, return the length of the longest strictly increasing subsequence. A subsequence is a sequence that can be derived from the array by deleting some or no elements without changing the order of the remaining elements.',
    difficulty: 'Hard',
    topic: 'Dynamic Programming',
    constraints: [
      '1 <= nums.length <= 2500',
      '-10^4 <= nums[i] <= 10^4'
    ],
    examples: [
      {
        input: 'nums = [10,9,2,5,3,7,101,18]',
        output: '4',
        explanation: 'The longest increasing subsequence is [2,3,7,101], therefore the length is 4.'
      },
      {
        input: 'nums = [0,1,0,4,4,4,3,5,9]',
        output: '4',
        explanation: 'The longest increasing subsequence is [0,1,4,5,9] with length 4.'
      }
    ],
    testCases: [
      { input: '[10,9,2,5,3,7,101,18]', expectedOutput: '4', hidden: false },
      { input: '[0,1,0,4,4,4,3,5,9]', expectedOutput: '5', hidden: false },
      { input: '[3,10,2,1,20]', expectedOutput: '3', hidden: true }
    ],
    boilerplate: {
      c: 'int lengthOfLIS(int* nums, int numsSize) {\n    // Your code here\n    return 0;\n}',
      cpp: 'int lengthOfLIS(vector<int>& nums) {\n    // Your code here\n    return 0;\n}',
      java: 'public int lengthOfLIS(int[] nums) {\n    // Your code here\n    return 0;\n}'
    },
    hints: ['Use DP array where dp[i] = length of LIS ending at index i', 'For each element, check all previous elements'],
    editorial: 'Dynamic Programming approach: maintain dp[i] as the length of LIS ending at index i. For each position, check all previous positions and update accordingly.',
    supportedLanguages: ['C', 'C++', 'Java']
  },

  {
    title: 'Word Break II',
    description: 'Given a string s and a dictionary of strings wordDict, return all possible sentences where each word in the sentence is from the dictionary. Return the result in any order.',
    difficulty: 'Hard',
    topic: 'Dynamic Programming',
    constraints: [
      '1 <= s.length <= 15',
      '1 <= wordDict.length <= 15',
      'All strings are unique'
    ],
    examples: [
      {
        input: 's = "catsandcatsdog", wordDict = ["cat","cats","and","sand","dog"]',
        output: '["cats and cats dog","cats and cat s dog"]',
        explanation: 'Backtracking with memoization to find all valid combinations'
      }
    ],
    testCases: [
      { input: 'catsandcatsdog\ncat,cats,and,sand,dog', expectedOutput: 'cats and cats dog', hidden: false },
      { input: 'pineapplepenapple\napple,pen,applepen', expectedOutput: 'pine apple pen apple', hidden: true }
    ],
    boilerplate: {
      c: '// Complex - return char** array',
      cpp: 'vector<string> wordBreak(string s, vector<string>& wordDict) {\n    // Your code here\n    return {};\n}',
      java: 'public List<String> wordBreak(String s, List<String> wordDict) {\n    // Your code here\n    return new ArrayList<>();\n}'
    },
    hints: ['Use backtracking with memoization', 'Avoid redundant computations by memoizing already explored states'],
    supportedLanguages: ['C++', 'Java']
  },

  {
    title: 'Median of Two Sorted Arrays',
    description: 'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log(m+n)).',
    difficulty: 'Hard',
    topic: 'Searching',
    constraints: [
      'nums1.length == m',
      'nums2.length == n',
      '0 <= m <= 1000',
      '0 <= n <= 1000',
      '-10^6 <= nums1[i], nums2[i] <= 10^6'
    ],
    examples: [
      {
        input: 'nums1 = [1,3], nums2 = [2]',
        output: '2.0',
        explanation: 'merged array = [1,2,3] and median is 2.'
      }
    ],
    testCases: [
      { input: '[1,3]\n[2]', expectedOutput: '2.0', hidden: false },
      { input: '[1,2]\n[3,4]', expectedOutput: '2.5', hidden: false }
    ],
    boilerplate: {
      c: 'double findMedianSortedArrays(int* nums1, int nums1Size, int* nums2, int nums2Size) {\n    // Your code here\n    return 0.0;\n}',
      cpp: 'double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {\n    // Your code here\n    return 0.0;\n}',
      java: 'public double findMedianSortedArrays(int[] nums1, int[] nums2) {\n    // Your code here\n    return 0.0;\n}'
    },
    hints: ['Use binary search on the partition of arrays', 'Think about the properties of the left and right partition'],
    editorialLink: 'https://example.com/median-explanation',
    supportedLanguages: ['C', 'C++', 'Java']
  },

  {
    title: 'Merge K Sorted Lists',
    description: 'You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.',
    difficulty: 'Hard',
    topic: 'Linked List',
    constraints: [
      'k == lists.length',
      '0 <= k <= 10^4'
    ],
    examples: [
      {
        input: 'lists = [[1,4,5],[1,3,4],[2,6]]',
        output: '[1,1,2,1,3,4,4,5,6]',
        explanation: 'The linked-lists are merged into one sorted list.'
      }
    ],
    testCases: [
      { input: '[[1,4,5],[1,3,4],[2,6]]', expectedOutput: '[1,1,2,1,3,4,4,5,6]', hidden: false },
      { input: '[]', expectedOutput: '[]', hidden: false }
    ],
    boilerplate: {
      c: 'struct ListNode* mergeKLists(struct ListNode** lists, int listsSize) {\n    // Your code here\n    return NULL;\n}',
      cpp: 'ListNode* mergeKLists(vector<ListNode*>& lists) {\n    // Your code here\n    return nullptr;\n}',
      java: 'public ListNode mergeKLists(ListNode[] lists) {\n    // Your code here\n    return null;\n}'
    },
    hints: ['Use a min heap or priority queue', 'Divide and conquer approach also works'],
    supportedLanguages: ['C', 'C++', 'Java']
  },

  {
    title: 'Regular Expression Matching',
    description: 'Given an input string s and a pattern p, implement regular expression matching with support for "." and "*" where "." matches any single character and "*" matches zero or more of the preceding element.',
    difficulty: 'Hard',
    topic: 'Dynamic Programming',
    constraints: [
      '1 <= s.length <= 20',
      '1 <= p.length <= 30'
    ],
    examples: [
      {
        input: 's = "aa", p = "a"',
        output: 'false',
        explanation: '"a" does not match the entire string "aa".'
      }
    ],
    testCases: [
      { input: 'aa\na', expectedOutput: 'false', hidden: false },
      { input: 'aa\na*', expectedOutput: 'true', hidden: false },
      { input: 'ab\n.*', expectedOutput: 'true', hidden: true }
    ],
    boilerplate: {
      c: 'bool isMatch(char* s, char* p) {\n    // Your code here\n    return false;\n}',
      cpp: 'bool isMatch(string s, string p) {\n    // Your code here\n    return false;\n}',
      java: 'public boolean isMatch(String s, String p) {\n    // Your code here\n    return false;\n}'
    },
    hints: ['Use 2D DP where dp[i][j] represents if s[0..i-1] matches p[0..j-1]', 'Handle "*" specially as it can match 0 or more characters'],
    supportedLanguages: ['C', 'C++', 'Java']
  },

  {
    title: 'Trapping Rain Water',
    description: 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
    difficulty: 'Hard',
    topic: 'Arrays',
    constraints: [
      'n == height.length',
      '1 <= n <= 2 * 10^4',
      '0 <= height[i] <= 10^5'
    ],
    examples: [
      {
        input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]',
        output: '6',
        explanation: 'Rain water trapped = 6'
      }
    ],
    testCases: [
      { input: '[0,1,0,2,1,0,1,3,2,1,2,1]', expectedOutput: '6', hidden: false },
      { input: '[4,2,0,3,2,5]', expectedOutput: '9', hidden: false }
    ],
    boilerplate: {
      c: 'int trap(int* height, int heightSize) {\n    // Your code here\n    return 0;\n}',
      cpp: 'int trap(vector<int>& height) {\n    // Your code here\n    return 0;\n}',
      java: 'public int trap(int[] height) {\n    // Your code here\n    return 0;\n}'
    },
    hints: ['For each position, water level = min(max_left, max_right) - height[i]', 'Use prefix and suffix max arrays or two pointers'],
    supportedLanguages: ['C', 'C++', 'Java']
  }
];

module.exports = dsaQuestions;
