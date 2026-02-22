import { CELL_TYPES, DIRECTIONS, DIR_OFFSETS } from '../constants/blocks';

export function isInBounds(row, col, grid) {
  return row >= 0 && row < grid.length && col >= 0 && col < grid[0].length;
}

export function isWalkable(row, col, grid) {
  if (!isInBounds(row, col, grid)) return false;
  const cell = grid[row][col];
  return cell !== CELL_TYPES.WALL && cell !== CELL_TYPES.WATER && cell !== CELL_TYPES.LAVA;
}

export function getForwardPos(row, col, direction) {
  const offset = DIR_OFFSETS[direction];
  return { row: row + offset.row, col: col + offset.col };
}

export function turnLeft(direction) {
  return (direction + 3) % 4;
}

export function turnRight(direction) {
  return (direction + 1) % 4;
}

export function isWallAhead(row, col, direction, grid) {
  const next = getForwardPos(row, col, direction);
  return !isWalkable(next.row, next.col, grid);
}

export function isPathAhead(row, col, direction, grid) {
  return !isWallAhead(row, col, direction, grid);
}

export function getCellAt(row, col, grid) {
  if (!isInBounds(row, col, grid)) return CELL_TYPES.WALL;
  return grid[row][col];
}

export function countStars(grid) {
  let count = 0;
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c] === CELL_TYPES.STAR) count++;
    }
  }
  return count;
}

export function countGems(grid) {
  let count = 0;
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c] === CELL_TYPES.GEM) count++;
    }
  }
  return count;
}

export function cloneGrid(grid) {
  return grid.map(row => [...row]);
}
