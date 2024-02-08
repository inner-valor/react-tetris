import {useState, useEffect, useCallback} from 'react';

export const useGameStatus = rowsCleared => {
    const [score, setScore] = useState(0);
    const [rows, setRows] = useState(0);
    const [level, setLevel] = useState(0);
    const [hiscore, setHiScore] = useState(0);

    const linePoints = [40, 100, 300, 1200];

    const calcScore = useCallback(() => {
        // we have score
        if(rowsCleared > 0) {
            setScore(prev => prev + linePoints[rowsCleared - 1] * (level + 1));
            setRows(prev => prev + rowsCleared);
        }
    }, [level, linePoints, rowsCleared]);

    useEffect(() => {
        calcScore();
        // if score is more than hiScore
        if (score > hiscore) {
            setHiScore(score);
        }
    }, [calcScore, rowsCleared, score, hiscore]);

    return [score, setScore, rows, setRows, level, setLevel, hiscore, setHiScore];
}