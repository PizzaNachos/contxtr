
import { get_user_id } from '$lib/user_store';
import type { PageLoad } from '../$types';
import { supabase } from '../../lib/supabase_client';
import { json } from '@sveltejs/kit';

export const load: PageLoad = async ({ params }) => {
    const user = await get_user_id()
    if (user == null){
        return {
            tags: [],
            words: [],
            sentences: new Map()
        }
    }
    
    let tags = (await supabase.from("tags").select()).data
    let words = (await supabase.from("words").select()).data

    let test = await supabase
    .from('sentences')
    .select()
    .in('word_id', words.map(w => w.id))

    if(test.error != null){
        console.error(test)
        return {
            sentence_map: new Map(),
            words: []
        }
    }

    let all_sen = test.data
    let test_map = new Map()

    for(let i = 0; i < all_sen.length; i++){
        let tmp_arr = test_map.get(all_sen[i].word_id) ?? []
        tmp_arr.push(all_sen[i])
        test_map.set(all_sen[i].word_id, tmp_arr)
    }
    // for (let i = 0; i < words.length; i++) {
    //     let { data, error } = await supabase
    //         .from('sentences')
    //         .select()
    //         .eq('word_id', words[i].id)
    //         .eq("user_id", user)
    //     // console.log("Sentences", data, error)
    //     if (error) {
    //         console.log(error)
    //     }
    //     // let t : SentenceType[] = await supabase.from("words").select();
        // m.set(words[i].word, data ?? []);
    // }
    return {
        tags: tags,
        words: words,
        sentences: test_map
    }
};