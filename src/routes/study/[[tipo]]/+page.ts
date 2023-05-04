// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
// import type { PageLoad } from './$types';
// import type { SentenceType, WordType } from '../aapi/types';
import { supabase } from "$lib/supabase_client";
import { user, get_user_id } from "$lib/user_store";
import { get } from 'svelte/store';
export const ssr = false;
export const load = async ({params, url, fetch, depends}) => {
    depends("Äuth")
    const u = await get_user_id()
    if (u == null){
        user.set({user:null, logged_in:-1, loading: false});
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
    let words = [];
    if (tag_id != -1){
        let { data } = await supabase
            .from("words")
            .select("*, word_to_tag(*)")
            .eq("user_id", u)
            .eq("word_to_tag.tag_id", tag_id)
            .lt('next_study', next_study)
            .order('next_study', 
                { ascending: true }
            );
        console.log("data",data)
        words = data ?? []
    } else {
        let { data } = await supabase
            .from("words")
            .select()
            .eq("user_id", u)
            .lt('next_study', next_study)
            .order('next_study', 
                { ascending: true }
            );
        console.log("First fetch data", data)
        words = data ?? []
    }

    console.log("Number of words", words.length)

    let test = await supabase
        .from('sentences')
        .select()
        .in('word_id', words.map(w => w.id))
        .eq("user_id", u)

    if(test.error != null){
        console.log(test)
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

    console.log(test_map)


    return {
        sentence_map: test_map,
        words: words
    }
}
