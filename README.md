# contxt'r
This is a simple flash card style app built for vocabulary learning tailored twords foreign language.

## Tech
This is a sveltekit app running client side only with supabase as a backend
simply set supabase public url and public key as env variables and create a user
in your supabase dash board to get started

It runs off the idea that reading a word in context is so much more helpful than in isolation
With the same SM-2 spaced algorithm as the Anki flashcard app.
Each word is associated with sentences and each time you are exposes to a word you should see a different sentence using that word. Words can be associated together as variations of stuff.

Unsure how to tackle the problem of conjucated words being easier to recall directly after each other (ex, hablar -> fail (now seen) hablo -> good (should have been fail and would be on its own))

Potential solution:
    have a tree of conjucations that influence each other, associated words with their own competence but they are associated with each other (maybe with a strength? guapo vs guapa is very strongly but comer vs comiste is less associated) and the strength of one competence update affects the others by their associated strength