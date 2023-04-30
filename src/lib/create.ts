import { supabase } from "./supabase_client"
import { get_user_id } from "./user_store"



export async function post_sentence(sentence: {sentence:string[], translation:string[]}, word_id){
    let user = await get_user_id()
    console.log("USER",user)
    let postable_data = {
        text: sentence.sentence,
        translation: sentence.translation,
        word_id: word_id,
        match_regex: sentence.translation[1],
        last_seen: Date.now(),
        user_id: user
    }
    console.log(postable_data)
    const returned = await supabase.from('sentences').insert(postable_data).select()
    return returned;
}

export async function post_word(word:string){
    let user = await get_user_id()
    let postable_word = {
        word: word,
        competence_object : {
            status: 'learning',
            ease: 0,
            learning_step: 1
        },
        user_id: user
    }
    const new_word = await supabase.from('words').insert(word).select()
    console.log("Created word from postgres", new_word);
    return new_word
}
