
import type { PageLoad } from '../$types';
import { supabase } from '../../lib/supabase_client';
import { json } from '@sveltejs/kit';
export const load: PageLoad = async () => {
    // let tag_supabase = (await.eq("name", tag));


    let tags = (await supabase.from("tags").select()).data
    let words = (await supabase.from("words").select()).data
    let m = new Map()
    for (let i = 0; i < words.length; i++) {
        let { data, error } = await supabase
            .from('sentences')
            .select()
            .eq('word_id', words[i].id)
        // console.log("Sentences", data, error)
        if (error) {
            console.log(error)
        }
        // let t : SentenceType[] = await supabase.from("words").select();
        m.set(words[i].word, data ?? []);
    }
    return {
        tags: tags,
        words: words,
        sentences: m
    }
};