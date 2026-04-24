import {GameLanguage} from "@/src/types/game";
import dictionary from "@/src/data/dictionary.json";

export const getRandomSolution = (lang: GameLanguage): string => {
    const words = dictionary[lang];
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex].toUpperCase();
};

export const getDailySolution = (lang: GameLanguage): string => {
    const words = dictionary[lang];
    const today = new Date().setHours(0, 0, 0, 0); // Normalized timestamp
    const index = today % words.length;
    return words[index].toUpperCase();
};