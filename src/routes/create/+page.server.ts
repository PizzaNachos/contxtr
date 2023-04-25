
import type { PageLoad } from '../$types';
import { supabase } from '../../lib/supabase_client';
import { json } from '@sveltejs/kit';

export const load: PageLoad = async ({ params, cookies }) => {
    let usr_cookie = cookies.get("sb-access-token")
    let sess = {}
    if (usr_cookie == undefined){
    } else {
        sess = supabase.auth.getUser(usr_cookie)
    }
    const user = sess?.data?.user?.id ?? null
    if (user == null){
        return {
            tags: [],
            words: [],
            sentences: new Map()
        }
    }
    
    let tags = (await supabase.from("tags").select()).data
    let words = (await supabase.from("words").select()).data
    let m = new Map()
    for (let i = 0; i < words.length; i++) {
        let { data, error } = await supabase
            .from('sentences')
            .select()
            .eq('word_id', words[i].id)
            .eq("user_id", user)
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