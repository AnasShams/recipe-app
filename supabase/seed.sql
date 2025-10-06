-- Seed public recipes (owned by NULL, visible to everyone)
insert into public.recipes (user_id, title, image_url, ingredients, steps, is_public)
values
  (
    null,
    'Fluffy Pancakes',
    'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&q=80&auto=format&fit=crop',
    E'1 1/2 cups flour\n3 1/2 tsp baking powder\n1 tbsp sugar\n1 egg\n1 1/4 cups milk',
    E'Whisk dry ingredients.\nAdd milk and egg; whisk until smooth.\nCook on greased skillet until bubbles form; flip and finish.',
    true
  ),
  (
    null,
    'Creamy Garlic Pasta',
    'https://images.unsplash.com/photo-1526318472351-c75fcf070305?w=1200&q=80&auto=format&fit=crop',
    E'200g pasta\n2 cloves garlic\n1 cup cream\nParmesan\nSalt & pepper',
    E'Cook pasta al dente.\nSauté garlic in butter; add cream and reduce.\nToss with pasta and Parmesan; season.',
    true
  ),
  (
    null,
    'Fresh Garden Salad',
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&q=80&auto=format&fit=crop',
    E'Lettuce\nTomatoes\nCucumber\nOlive oil\nLemon',
    E'Chop veggies.\nDress with oil and lemon.\nToss and serve.',
    true
  );


