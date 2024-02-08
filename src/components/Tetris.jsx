import React, { useState } from 'react';

import { createStage, checkCollision } from '../gameHelpers';

// styled components
import { StyledTetrisWrapper, StyledTetris } from './styles/StyledTetris';
import { StyledStageWrapper } from './styles/StyledStageWrapper';

// custom hooks
import { useInterval } from '../hooks/useInterval';
import { usePlayer } from '../hooks/usePlayer';
import { useStage } from '../hooks/useStage';
import { useGameStatus } from '../hooks/useGameStatus';

// components

import Stage from './Stage';
import Display from './Display';
import StartButton from './StartButton';
import Overlay from './Overlay';




const Tetris = () => {
    const [dropTime, setDropTime] = useState(null);
    const [gameOver, setGameOver] = useState(false);

    const [player, updatePlayerPos, resetPlayer, playerRotate] = usePlayer();
    const [stage, setStage, rowsCleared] = useStage(player, resetPlayer);
    const [score, setScore, rows, setRows, level, setLevel, hiScore] = useGameStatus(rowsCleared);
    const [pause, setPause] = useState(false);

    const speed = 1000 / (level + 1) + 200;


    const movePlayer = dir => {
        if (!checkCollision(player, stage, { x: dir, y: 0 })) {
            updatePlayerPos({ x: dir, y: 0 });
        }
    }

    const startGame = () => {
        // reset
        setStage(createStage());
        setDropTime(1000);
        resetPlayer();
        setGameOver(false);
        setScore(0);
        setRows(0);
        setLevel(0);
        setPause(false);

    };

    const drop = () => {
        // increase level after 10 rows cleared
        if (rows > (level + 1) * 10) {
            setLevel(prev => prev + 1);
            // increase speed
            setDropTime(speed);
        }

        if (!checkCollision(player, stage, { x: 0, y: 1 })) {
            updatePlayerPos({ x: 0, y: 1, collided: false });

        } else {
            if (player.pos.y < 1) {
                setGameOver(true);
                setDropTime(null);
            }
            updatePlayerPos({ x: 0, y: 0, collided: true });
        }
    }

    const keyUp = ({ keyCode }) => {
        if (!gameOver && !pause) {
            if (keyCode === 40) {
                setDropTime(speed);
            }

        }
    }

    const dropPlayer = () => {
        setDropTime(null);
        drop();
    }


    const move = ({ keyCode }) => {

        if (keyCode === 80) {
            if (pause) {
                setPause(false);
                setDropTime(speed);
            } else {
                setPause(true);
                setDropTime(null);
            }
        }

        if (!gameOver && !pause) {

            if (keyCode === 37) {
                movePlayer(-1);
            } else if (keyCode === 39) {
                movePlayer(1);
            } else if (keyCode === 40) {
                dropPlayer();
            } else if (keyCode === 38) {
                playerRotate(stage, 1);
            }

        }
    }

    useInterval(() => {
        drop();
    }, dropTime)

    return (
        <StyledTetrisWrapper role="button" tabIndex="0" onKeyDown={e => move(e)} onKeyUp={keyUp}>
            <StyledTetris>
                <StyledStageWrapper>
                    {pause && <Overlay text={"Pause"} />}
                    <Stage stage={stage} />
                </StyledStageWrapper>

                <aside>
                    <Display text={`Hi-Score: ${hiScore}`} />
                    {gameOver ? (
                        <Display gameOver={gameOver} text={"Game Over"} />
                    ) : (
                        <div>
                            <Display text={`Score: ${score}`} />
                            <Display text={`Rows: ${rows}`} />
                            <Display text={`Level: ${level}`} />
                        </div>
                    )}
                    <StartButton callback={startGame} />
                </aside>
            </StyledTetris>
        </StyledTetrisWrapper>
    )
}

export default Tetris;