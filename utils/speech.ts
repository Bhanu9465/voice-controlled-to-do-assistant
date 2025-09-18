export const speak = (text: string) => {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        window.speechSynthesis.cancel(); // Cancel any previous speech
        window.speechSynthesis.speak(utterance);
    } else {
        console.warn('Speech synthesis not supported in this browser.');
    }
};
