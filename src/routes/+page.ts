// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
import type { PageLoad } from './$types';
// import type { SentenceType, WordType } from './aapi/types';

export const prerender = true;
export const load : PageLoad = async ({fetch}) => {
    // let s : SentenceType[] = await fetch("/aapi/sentences")
    //     .then(res => res.json())
    //     .catch(err => [])
    // let words : WordType[] = await fetch("/aapi/words")
    //     .then(res => res.json())
    //     .catch(err => [])

    // let m = new Map<string, SentenceType[]>()
    // for(let i = 0; i < s.length; i++){
    //     let word = m.get(words[s[i].target].word);
    //     if (word == undefined){
    //         m.set(words[s[i].target].word, [s[i]]);
    //     } else {
    //         word.push(s[i])
    //     }
    // }
    // console.log(m)
    // return {
    //     sentence_map: m,
    //     words: words
    // }
};
