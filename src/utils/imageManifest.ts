// Auto-generated image manifest
// Generated on: 2026-02-09T08:15:05.983Z
// Total images: 116

export const IMAGE_MANIFEST: Record<string, string[]> = {
  "cakes": [
    "baby-cake.jpg",
    "baley-cake.jpg",
    "black-panther-cake.jpg",
    "blue-cake.jpg",
    "blue-glitter-cake.jpg",
    "buttercream-cake.jpg",
    "car-cake.jpg",
    "cricket-cake.jpg",
    "death-by-chocolate-cake.jpg",
    "denim-cake.jpg",
    "dnd-cake.jpg",
    "flower-cake.jpg",
    "frozen-cake.jpg",
    "hello-kitty-cake.jpg",
    "mermaid-cake.jpg",
    "mom-birthday-cake.jpg",
    "oreo-cookies.jpg",
    "pick-cake.jpg",
    "pink-flower-cake.jpg",
    "shiny-pink-cake.jpg",
    "strawberry-cake.jpg",
    "white-gold-sparkle-cake.jpg"
  ],
  "cupcakes": [
    "blue-green-white-purple-cupcakes.jpg",
    "butterfly-cupcakes.jpg",
    "cancer-awareness-cupcakes.jpg",
    "cupcake-box.jpg",
    "denim-cupcakes.jpg",
    "elsa-cupcakes.jpg",
    "flower-cupcakes.jpg",
    "green-pink-cupcakes.jpg",
    "green-white-blue-pink-cupcakes.jpg",
    "mermaid-cupcakes.jpg",
    "soft-colour-cupcakes.jpg",
    "succulent-cupcakes.jpg",
    "tools-cupcakes.jpg"
  ],
  "cakesicles": [
    "cakesicle-treats.jpg",
    "cricket-cakesicles.jpg",
    "dc-cakesicles.jpg",
    "dinosaur-cakesicles.jpg",
    "halloween-cakesicles.jpg",
    "harry-potter-cakesicles.jpg",
    "pink-cakesicles.jpg"
  ],
  "treatboxes": [
    "16-treat-box.jpg",
    "denim-treats.jpg",
    "mix-cookies-box.jpg",
    "pokemon-treats-1.jpg",
    "star-wars-treats.jpg",
    "treats-1.jpg",
    "treats-2.jpg",
    "treats-3.jpg",
    "tyler-treat-box.jpg"
  ],
  "cookies": [
    "batman-cookies.jpg",
    "choco-oreo-cookies.jpg",
    "cinnamon-roll-cookies.jpg",
    "easter-cookies.jpg",
    "halloween-cookies-1.jpg",
    "halloween-cookies.jpg",
    "heart-cookies.jpg",
    "xmas-cookies.jpg"
  ],
  "desserts": [
    "dessert-1.jpg",
    "dessert-2.jpg",
    "dessert-3.jpg",
    "dessert-4.jpg",
    "dessert-5.jpg",
    "dessert-6.jpg",
    "dessert.jpg"
  ],
  "biscotti": [
    "admond-cranberry-biscotti.jpg"
  ],
  "meals": [
    "meal-1.jpg",
    "meal-10.jpg",
    "meal-11.jpg",
    "meal-12.jpg",
    "meal-13.jpg",
    "meal-14.jpg",
    "meal-2.jpg",
    "meal-3.jpg",
    "meal-4.jpg",
    "meal-5.jpg",
    "meal-6.jpg",
    "meal-7.jpg",
    "meal-8.jpg",
    "meal-9.jpg"
  ],
  "bento": [
    "bento-blue.jpg",
    "bento-pink.jpg"
  ],
  "smash": [
    "birthday-smash.jpg",
    "bunny-butt-smash.jpg",
    "smash-hearts.jpg"
  ],
  "occasions": [
    "easter-donuts.jpg",
    "easter-egg.jpg",
    "easter-treat-box-1.jpg",
    "easter-treat-box.jpg",
    "halloween-house.jpg",
    "rose-pink-cakesicles.jpg",
    "valentines-box-1.jpg",
    "valentines-box-2.jpg",
    "valentines-box-3.jpg",
    "valentines-box-4.jpg",
    "valentines-box-5.jpg",
    "valentines-box-6.jpg",
    "valentines-box-7.jpg",
    "valentines-box-8.jpg",
    "valentines-box.jpg",
    "valentines-treat-box-1.jpg",
    "valentines-treat-box.jpg",
    "xmas-box-1.jpg",
    "xmas-box.jpg",
    "xmas-cakesicles.jpg"
  ],
  "treats": [
    "grogu-choc-bomb.jpg",
    "hazelnut-fudge-treats.jpg",
    "marshmallow-fudge.jpg",
    "peppermint-crisp-treats.jpg",
    "treats-table-1.jpg",
    "treats-table.jpg",
    "turkish-delight-treats.jpg",
    "unicorn-choco-bomb.jpg"
  ],
  "specials": [
    "vday1.jpg",
    "vday2.jpg"
  ]
};

export const getTotalImageCount = (): number => {
  return Object.values(IMAGE_MANIFEST).reduce((sum, images) => sum + images.length, 0);
};

export const getCategoryImageCount = (category: string): number => {
  return IMAGE_MANIFEST[category]?.length || 0;
};
