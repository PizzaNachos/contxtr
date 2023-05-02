import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from "@sveltejs/kit";
import type { Competence, SentenceType, WordType } from '../../../../lib/types';
 import { supabase } from '$lib/supabase_client';

const calculate_new_competence = (old : Competence, change : 1|2|3|4) => {
    let updated : Competence = old
    if (old.status == 'lapsed') {
        return handle_lapsed(old, change);
    } else if (old.status == 'learning'){
        return handle_learning(old,change)
    } else if (old.status == 'review'){
        return handle_review(old,change)
    }
    return updated
}
function handle_lapsed(old : Competence, change : 1|2|3|4){
    let updated : Competence = old
    if (change == 1 || change == 2){
        updated.status = 'learning'
        updated.learning_step = 3
    } else {
        updated.status = 'review'
        updated.ease = old.ease - .1
    }
    return updated
}
function handle_learning(old : Competence, change : 1|2|3|4){
    let updated : Competence = old;
    if (change == 1){
        updated.learning_step = 1
    } else if (change == 2){
        updated.learning_step = old.learning_step
    } else if( change == 3 && old.learning_step != 4){
        updated.learning_step = old.learning_step + 1
    } else if(change == 4 || (change == 3 && old.learning_step == 4)){
        updated.status = 'review'
        updated.ease = 2.25
    }
    return updated
}
function handle_review(old:Competence, change: 1|2|3|4){
    let updated : Competence = old
    if (change == 1){
        updated.status = 'lapsed'
        updated.ease -= .2
    } else if (change == 2){
        updated.ease -= .15
    } else if( change == 3){
        updated.ease = old.ease
    } else if(change == 4){
        updated.ease += .15
    }
    return updated
}

const calculate_next_study = (comp : Competence) : number => {
    const day = 60 * 24
    const hour = 60
    let new_study = 0
    if (comp.status == "lapsed"){
        new_study = 10
    }

    if (comp.status == 'learning') {
        switch (comp.learning_step) {
            case 1:
                new_study = 1
                break;
            case 2:
                new_study = 10
                break;
            case 3:
                new_study = hour
                break;
            case 4:
                new_study = day
                break;
        }
    }

    if (comp.status == 'review') {
        new_study = comp.ease * 60 * 24
    }

    return new_study < (day * 30) ? new_study : (day * 30)
}

let default_competence : Competence = {
    status:"learning",
    ease: 0,
    learning_step: 1,
}
export const POST = (async ({request}) => {
    let {word, change, sentence_id} = await request.json().catch(err => "broke")
    let now = Date.now()
    const ok = await supabase.from('sentences').update({last_seen: now}).eq('id',sentence_id)
    console.log(ok)
    // Word competence should absolutly be like an object encoding lots of info 
    let new_competence = word.competence_object ?? default_competence;
    if (!word.reverse){
        new_competence = calculate_new_competence(word.competence_object ?? default_competence,change);
    }
    let new_interval = calculate_next_study(new_competence) * 1000 * 60 
    let next_study = now + new_interval

    const sp = await supabase
        .from('words')
        .update({ competence_object: new_competence, next_study: next_study, reverse: word.reverse ? false : true})
        .eq('id', word.id)
        .select()


    let new_one = sp?.data[0]
    console.log(new_one)
    if (new_one?.next_study < now){
        return json(new_one)
    } else {
        return json("")
    }

}) satisfies RequestHandler;
