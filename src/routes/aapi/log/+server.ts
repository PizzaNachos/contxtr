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


// function encrypt() {
// 	var textElem = document.getElementById("plaintext");
// 	var input = textElem.value.toLowerCase();
// 	var output = "";
// 	if (input.length%2 != 0) {
//             output += "Text must have an even number of letters";
// 	} else {
//            for(var i = 0; i < input.length; i+=2) {
// 		var c1 = input.charCodeAt(i);
// 		var c2 = input.charCodeAt(i+1);
// 	        output += String.fromCharCode((2*(c1-97)+7*(c2-97)+12) % 26 + 65);
// 	        output += String.fromCharCode((5*(c1-97)+17*(c2-97)+12) % 26 + 65);
//            } 
// 	}
//         textElem.value = output;
// }
