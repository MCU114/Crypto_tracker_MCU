export type GuideTag = 'Beginner' | 'Intermediate' | 'Advanced';

export type GuideCategory = {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon?: string;
};

export type Guide = {
  id: string;
  slug: string;
  categorySlug: string;
  title: string;
  description: string;
  tag: GuideTag;
  metaTitle: string;
  metaDescription: string;
  // Detail page content
  definition: string;
  howItWorks: string;
  howToRead: string;
  example: string;
  pros: string[];
  cons: string[];
  commonMistakes: string[];
};
