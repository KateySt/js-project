import {useEffect, useState} from 'react';
import {CiMicrophoneOff, CiMicrophoneOn} from "react-icons/ci";
import './soundRecorder.css';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.interimResults = true;

const SoundRecorder = ({setText}) => {
    const [isStreamRecording, setIsStreamRecording] = useState(false);

    useEffect(() => {
        recognition.addEventListener('result', handleRecognitionResult);
        recognition.addEventListener('end', handleRecognitionEnd);
        return () => {
            recognition.removeEventListener('result', handleRecognitionResult);
            recognition.removeEventListener('end', handleRecognitionEnd);
        };
    }, []);

    const handleRecognitionResult = (e) => {
        const transcript = Array.from(e.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');
        setText(transcript);
    };

    const handleRecognitionEnd = () => {
        setIsStreamRecording(false);
    };

    const startRec = () => {
        setIsStreamRecording(true);
        recognition.start();
    };

    const stopRec = () => {
        recognition.stop();
    };

    return (
        <>
            {!isStreamRecording ? (
                <CiMicrophoneOff
                    className="mic-btn"
                    onMouseDown={startRec}

                />
            ) : (
                <CiMicrophoneOn
                    className="mic-btn"
                    onMouseUp={stopRec}
                />
            )}
        </>
    );
};

export default SoundRecorder;