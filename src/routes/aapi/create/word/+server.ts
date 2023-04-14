import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from "@sveltejs/kit";
import type { SentenceType, WordType } from '../../types';
 import { supabase } from '$lib/supabase_client';

export const POST = (async ({request}) => {
    let req = await request.json().catch(err => "broke")

    let word = {
        word: req.word,
        competence_object : {
            status: 'learning',
            ease: 0,
            learning_step: 1
        }
    }
    const new_word = await supabase.from('words').insert(word).select()
    console.log(new_word)
    return json(new_word.data[0])

}) satisfies RequestHandler;
