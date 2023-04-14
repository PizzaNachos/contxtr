import { supabase } from "$lib/supabase_client"
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";

export const POST = (async ({request}) => {
    let req = await request.json().catch(err => "broke")

    const sb = await supabase.auth.signInWithPassword({
        email: req.usr,
        password: req.psw,
    })
    // const new_word = await supabase.from('words').insert(word).select()
    if(sb.data){
        return json(sb.data)
    } else {
        throw error(400,sb.error)
    }

}) satisfies RequestHandler;

