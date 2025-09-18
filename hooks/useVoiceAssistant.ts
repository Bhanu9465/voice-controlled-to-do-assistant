import { useState, useEffect, useRef, useCallback } from 'react';
import { ParsedCommand, Task } from '../types';
import { parseCommand } from '../services/geminiService';

// Type definitions for the Web Speech API
interface SpeechRecognitionAlternative {
    readonly transcript: string;
    readonly confidence: number;
}
interface SpeechRecognitionResult {
    readonly isFinal: boolean;
    readonly length: number;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
}
interface SpeechRecognitionResultList {
    readonly length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
}
interface SpeechRecognitionEvent extends Event {
    readonly resultIndex: number;
    readonly results: SpeechRecognitionResultList;
}
interface SpeechRecognitionErrorEvent extends Event {
    readonly error: string;
    readonly message: string;
}
interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
    onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
    onend: (() => any) | null;
    start(): void;
    stop(): void;
    abort(): void;
}
const SpeechRecognition = ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition) as { new(): SpeechRecognition };
const isSupported = !!SpeechRecognition;


interface VoiceAssistantOptions {
    onCommand: (command: ParsedCommand | null) => void;
    tasks: Task[];
}

interface UseVoiceAssistantResult {
    isListening: boolean;
    startListening: () => void;
    stopListening: () => void;
    error: string | null;
    isSupported: boolean;
    interimTranscript: string;
}

export const useVoiceAssistant = ({ onCommand, tasks }: VoiceAssistantOptions): UseVoiceAssistantResult => {
    const [isListening, setIsListening] = useState(false);
    const [interimTranscript, setInterimTranscript] = useState('');
    const [error, setError] = useState<string | null>(null);
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    useEffect(() => {
        if (!isSupported) {
            setError('Voice recognition is not supported in this browser.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = async (event: SpeechRecognitionEvent) => {
            let tempInterim = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                const transcriptPart = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcriptPart;
                } else {
                    tempInterim += transcriptPart;
                }
            }
            setInterimTranscript(tempInterim);

            if (finalTranscript) {
                const command = await parseCommand(finalTranscript.trim(), tasks);
                onCommand(command);
            }
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            if (event.error !== 'no-speech' && event.error !== 'aborted') {
              setError(`Error: ${event.error}`);
            }
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
            setInterimTranscript('');
        };
        
        recognitionRef.current = recognition;

        return () => {
            recognitionRef.current?.abort();
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tasks]); // Rerun setup if tasks change for better parsing context

    const startListening = useCallback(() => {
        if (recognitionRef.current && !isListening) {
            setError(null);
            setInterimTranscript('');
            recognitionRef.current.start();
            setIsListening(true);
        }
    }, [isListening]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.abort();
            setIsListening(false);
        }
    }, [isListening]);

    return { isListening, startListening, stopListening, error, isSupported, interimTranscript };
};
