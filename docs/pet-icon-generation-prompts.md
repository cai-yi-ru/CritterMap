# Pet icon generation notes

Generated with Codex built-in image generation, followed by local chroma-key removal and WebP downscaling.

## Master prompt

> A single cute Japanese stationery mascot icon, centered character, extremely round simple silhouette, tiny solid dark-brown dot eyes, a tiny omega-shaped mouth, soft peach blush, warm cocoa-brown hand-drawn outline, muted pastel gouache and colored-pencil texture, gentle imperfect handmade edges, simple flat painted color shapes, and large readable facial features for a small UI icon. Generous empty padding around the subject. No badge, no circle behind the character, no frame, no props, no text, no typography, no symbols, no floor, and no cast shadow. Perfectly flat solid chroma-key background covering the entire canvas for later removal. Square 1:1 composition.

Species-specific details were appended for: cat, dog, rabbit, mouse, guinea pig, bird, reptile, lizard, snake, turtle, amphibian, frog, fish, hedgehog, sugar glider, ferret, chinchilla, capybara (wild animal), and a neutral mystery pet (other exotic pets).

The production files live in `public/pet-icons-v2/`. Transparent source PNGs remain in `tmp/imagegen-kawaii/`, and `node scripts/processPetIcons.cjs` rebuilds the WebP set.
