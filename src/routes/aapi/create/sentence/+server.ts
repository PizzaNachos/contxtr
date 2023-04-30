import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from '../../create_sentence/$types';
import type { SentenceType, WordType } from '../../../../lib/types';
 import { supabase } from '$lib/supabase_client';

export const POST = (async ({request}) => {
    let {word, sentence, sesh} = await request.json().catch(err => "broke")

    console.log(returned)
    // console.log("new", new_word)
    // Word competence should absolutly be like an object encoding lots of info 

    // let new_competence = calculate_new_competence(word.competence, change)
    // console.log(`chage:${change}, compte:${new_competence}`)
    // let next_study = Date.now() + (competence_to_time_map_min[new_competence] * 1000 * 60)
    // // COMPETENCY CHANGE

    // const { data, error } = await supabase
    //     .from('words')
    //     .update({ competence: new_competence, next_study: next_study})
    //     .eq('id', word.id)
    //     .select()

    // console.log("Server Update", data, "Added study time min", competence_to_time_map_min[new_competence])
    if (!returned.error){
        return json(returned.data[0])
    } else {
        throw error(400, returned.error)
    }

}) satisfies RequestHandler;

