import React from "react";
import { StyledCell } from "./styles/StyledCell";
import { TETROMINOS } from "../tetrominos";

const Cell = ({ type }) => (
    <StyledCell type={type} color={TETROMINOS[type].color} />
)

// eslint-disable-next-line react-refresh/only-export-components
export default React.memo(Cell);