import { supabase } from "./supabase_client"
import { get_user_id } from "./user_store"
import type { TagType } from "$lib/types"


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
    console.log("Send to database", postable_data)
    const returned = await supabase.from('sentences').insert(postable_data).select()
    console.log("Recieved from database", returned)
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
    const new_word = await supabase.from('words').insert(postable_word).select()
    return new_word
}
export async function post_tag(tag:string) {
    let user = await get_user_id()
    let postable_data = {
        name: tag,
        user_id:user,
    }
    const returned_data = await supabase.from('tags').insert(postable_data).select()
    console.log("Created tag from postgres", returned_data);
    return returned_data
}
