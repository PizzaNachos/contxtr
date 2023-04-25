// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
// import type { PageLoad } from './$types';
// import type { SentenceType, WordType } from '../aapi/types';
import { supabase } from "$lib/supabase_client";

export const load = async ({ fetch, params, url, cookies}) => {
    let usr_cookie = cookies.get("sb-access-token")
    let sess = {}
    if (usr_cookie == undefined){
    } else {
        sess = supabase.auth.getUser(usr_cookie)
    }
    const user = sess?.data?.user?.id ?? null
    if (user == null){
        return {
            sentence_map: new Map(),
            words: []
        }
    }
    

    let tag =  params.tipo
    let next_study = Date.now();
    if (url?.searchParams?.get("time") == "future") {
        // One hour
        next_study += (1000 * 60 * 60 * 1)
        console.log("Future",next_study)
    }


    let tag_supabase = (await supabase.from("tags").select().eq("name", tag));
    let tag_id = tag_supabase.data?.at(0)?.id ?? -1
    // console.log("t.id", tag_id)
    let words = [];
    if (tag_id != -1){
        let { data } = await supabase
            .from("words")
            .select("*, word_to_tag(*)")
            .eq("user_id", user)
            .eq("word_to_tag.tag_id", tag_id)
            .lt('next_study', next_study)
            .order('next_study', 
                { ascending: true }
            );
        words = data ?? []
    } else {
        let { data } = await supabase
            .from("words")
            .select()
            .eq("user_id", user)
            .lt('next_study', next_study)
            .order('next_study', 
                { ascending: true }
            );
        words = data ?? []
    }
    
    console.log("Number of words", words.length)

    let m = new Map()
    let filtered_words = [];

    let sentences_callback = []
    for (let i = 0; i < words.length; i++) {
        let current =  supabase
            .from('sentences')
            .select()
            .eq('word_id', words[i].id)
            .eq("user_id", user)
        sentences_callback.push(current)
    }

    for(let i = 0; i < sentences_callback.length; i++){
        let {data, error} = await sentences_callback[i];
        if (error) {
            console.log(error)
        }
        if(data.length != 0 && data != null){
            filtered_words.push(words[i])
            m.set(words[i].word, data ?? []);
        } 
    }

    return {
        sentence_map: m,
        words: filtered_words
    }
}
