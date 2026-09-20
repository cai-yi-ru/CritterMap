import coolingCover from '../../public/blog/hamster-summer-cooling/cover.webp';
import coolingSetup from '../../public/blog/hamster-summer-cooling/safe-cooling-setup.webp';
import bitingCover from '../../public/blog/hamster-bar-biting/cover.webp';
import type { StaticImageData } from 'next/image';

// Static imports preserve the original aspect ratio and reserve image space.
export const blogImages: Record<string, StaticImageData> = {
  '/blog/hamster-summer-cooling/cover.webp': coolingCover,
  '/blog/hamster-summer-cooling/safe-cooling-setup.webp': coolingSetup,
  '/blog/hamster-bar-biting/cover.webp': bitingCover,
};
