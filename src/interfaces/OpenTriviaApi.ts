export interface OpenTrivia {
  response_code: 0 | 1 | 2 | 3 | 4;
  results: Result[];
}

export interface Result {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}
