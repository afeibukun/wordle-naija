import {GameLanguage} from "@/src/types/game";
import dictionary from "@/src/data/dictionary.json";

export const getRandomSolution = (lang: GameLanguage): string => {
    const words = dictionary[lang];
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex].toUpperCase();
};

export const getDailySolution = (lang: GameLanguage): string => {
    const words = dictionary[lang];
    const activeDays = getDaysSinceStart(new Date("2026-04-20"))
    const index = activeDays % words.length;
    return words[index].toUpperCase();
};

const getDaysSinceStart = (startDate: Date) => {
    const today = new Date();
    // 1. Get difference in milliseconds
    const diffInMs = today.getTime() - startDate.getTime();
    // 2. Convert to days and round down
    return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
};