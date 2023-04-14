// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
// import type { PageLoad } from './$types';
// import type { SentenceType, WordType } from '../aapi/types';
import { supabase } from "$lib/supabase_client";
export const ssr = false;


export const load = async ({ fetch, params }) => {
    let tag = params.tipo
    console.log("Tag:", tag)

    let tag_supabase = (await supabase.from("tags").select().eq("name", tag));
    let tag_id = tag_supabase.data?.at(0)?.id ?? -1
    console.log("t.id", tag_id)
    let words = [];
    if (tag_id != -1){
        let { data } = await supabase
            .from("words")
            .select("*, word_to_tag(*)")
            .eq("word_to_tag.tag_id", tag_id)
            .order('next_study', 
                { ascending: true }
            );
        words = data ?? []
    } else {
        let { data } = await supabase
            .from("words")
            .select()
            .lt('next_study', Date.now())
            .order('next_study', 
                { ascending: true }
            );
        words = data ?? []
    }
    
    // console.log("Number of words", words.length)

    let m = new Map()
    let filtered_words = [];
    console.log(words.map(w => w.word))
    for (let i = 0; i < words.length; i++) {
        let { data, error } = await supabase
            .from('sentences')
            .select()
            .eq('word_id', words[i].id)

        if (error) {
            console.log(error)
        }
        if(data.length != 0 && data != null){
            filtered_words.push(words[i])
            m.set(words[i].word, data ?? []);
        } 
    }

    // console.log(words)
    // console.log(m)
    return {
        sentence_map: m,
        words: filtered_words
    }
}
