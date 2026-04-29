import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import {db} from "@/src/lib/firebase";

export const submitFeedback = async (formData: any, lang: string) => {
    try {
        await addDoc(collection(db, "feedback"), {
            ...formData,
            language: lang,
            createdAt: serverTimestamp(), // Better than JS Date for sorting
        });
        return { success: true };
    } catch (error) {
        console.error("Error submitting feedback:", error);
        return { success: false };
    }
};
