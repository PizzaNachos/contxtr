
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

    let words = (await supabase.from("words").select()).data
    let word_ids = words.map(w => w.id);

    let tags = (await supabase
                .from("tags")
                .select("id, name, word_to_tag(word_id)"))
    let all_tags = tags.data
    console.log("Pre Data", all_tags);

    let tag_map = new Map()
    // Need a tag to word map but also a word to tag map and also just a list of tags?
    // Go over TAGS
    for(let i = 0; i < all_tags.length; i++){
        let tag_words = all_tags[i].word_to_tag
        for(let j = 0; j < tag_words.length; j++ ){
            let tmp_arr = tag_map.get(tag_words[j].word_id) ?? []
            tmp_arr.push(all_tags[i])
            tag_map.set(tag_words[j].word_id, tmp_arr)
        }
    }

    console.log("TAGS",tag_map);

    let test = await supabase
        .from('sentences')
        .select()
        .in('word_id', word_ids)

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

    return {
        tags_map: tag_map,
        tags: all_tags,
        words: words,
        sentences: test_map
    }
};