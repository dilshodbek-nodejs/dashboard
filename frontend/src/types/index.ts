export interface Test {
  id: string;
  question: string;
  options: TestOption[];
  createdAt: Date;
  topic?: string;
}

export interface TestOption {
  text: string;
  isCorrect: boolean;
}

export interface Blog {
  id: string;
  title: string;
  description: string;
  content: ContentBlock[];
  coverImage: string | null;
  createdAt: Date;
  status: 'draft' | 'published';
}

export interface ContentBlock {
  id: string;
  type: 'text' | 'image';
  content: string;
  order: number;
}

export interface TestTopic {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
}