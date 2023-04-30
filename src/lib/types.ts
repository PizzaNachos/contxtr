export interface Competence {
    status: "learning" | "review" | "lapsed",
    ease: number,
    learning_step: 1 | 2 | 3 | 4
}
export interface WordType{
    id: number,
    word: string,
    competence_object: Competence,
    next_study: number,
    tag?: string,
    reverse: boolean,
}

export interface SentenceType{
    text: [string, string]
    target: number,
    match_regex: string,
    translation: [string,string, string]
}