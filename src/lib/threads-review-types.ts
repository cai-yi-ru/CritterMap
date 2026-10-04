export type ReviewSection = { title: string; body: string };
export type ReviewSource = {
  id: string; hospital: string; purpose: string; label: string; url: string;
};
export type ReviewDraft = {
  id: string; month: string; city: string; filename: string; version: string;
  introduction: string;
  posts: { title: string; text: string }[];
  sources: ReviewSource[];
  sourceHeading: string;
  reviewed: boolean;
  review?: ReviewSection;
  notes: ReviewSection[];
};
