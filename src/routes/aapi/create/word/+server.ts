import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from "@sveltejs/kit";
import type { SentenceType, WordType } from '../../types';
 import { supabase } from '$lib/supabase_client';

export const POST = (async (params) => {
    let req = await params.request.json().catch(err => "broke")
    console.log("Creating word by userid",req.sesh.user.id);
    let user = req.sesh.user.id
    let word = {
        word: req.word,
        competence_object : {
            status: 'learning',
            ease: 0,
            learning_step: 1
        },
        user_id: user
    }
    const new_word = await supabase.from('words').insert(word).select()
    return json(new_word.data[0])

}) satisfies RequestHandler;
