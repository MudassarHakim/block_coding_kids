import { BLOCK_TYPES, BLOCK_DEFS, CELL_TYPES } from '../constants/blocks';
import { isWalkable, isWallAhead, isPathAhead, cloneGrid } from './gridUtils';

const MAX_STEPS = 500;

export function executeBlocks(blocks, level) {
  const steps = [];
  let grid = cloneGrid(level.grid);
  let row = level.startRow;
  let col = level.startCol;
  let dir = level.startDir ?? 1;
  let starsCollected = 0;
  let gemsCollected = 0;
  let totalSteps = 0;
  let reachedGoal = false;
  let error = null;

  steps.push({
    row, col, dir,
    grid: cloneGrid(grid),
    starsCollected,
    gemsCollected,
    action: 'start',
  });

  function collectAtPosition() {
    if (grid[row][col] === CELL_TYPES.STAR) {
      starsCollected++;
      grid[row][col] = CELL_TYPES.PATH;
    } else if (grid[row][col] === CELL_TYPES.GEM) {
      gemsCollected++;
      grid[row][col] = CELL_TYPES.PATH;
    }
    if (grid[row][col] === CELL_TYPES.GOAL) {
      reachedGoal = true;
    }
  }

  function tryMove(dRow, dCol, actionName) {
    const nr = row + dRow;
    const nc = col + dCol;
    if (isWalkable(nr, nc, grid)) {
      row = nr;
      col = nc;
      totalSteps++;
      collectAtPosition();
      steps.push({
        row, col, dir,
        grid: cloneGrid(grid),
        starsCollected,
        gemsCollected,
        action: actionName,
      });
    } else {
      totalSteps++;
      steps.push({
        row, col, dir,
        grid: cloneGrid(grid),
        starsCollected,
        gemsCollected,
        action: 'bump',
      });
    }
  }

  function runBlock(blockList, depth = 0) {
    if (depth > 20) { error = 'Too much nesting'; return; }

    for (let i = 0; i < blockList.length; i++) {
      if (totalSteps > MAX_STEPS) { error = 'Too many steps! Simplify your code.'; return; }
      if (error) return;

      const block = blockList[i];
      const def = BLOCK_DEFS[block.type];

      if (def && def.dirOffset) {
        tryMove(def.dirOffset.row, def.dirOffset.col, block.type);
        continue;
      }

      switch (block.type) {
        case BLOCK_TYPES.REPEAT: {
          const times = block.param || 2;
          const body = block.children || [];
          for (let t = 0; t < times; t++) {
            runBlock(body, depth + 1);
            if (error) return;
          }
          break;
        }
        case BLOCK_TYPES.IF_WALL: {
          const condition = isWallAhead(row, col, dir, grid);
          if (condition) {
            runBlock(block.children || [], depth + 1);
          } else if (block.elseChildren) {
            runBlock(block.elseChildren, depth + 1);
          }
          break;
        }
        case BLOCK_TYPES.IF_PATH: {
          const condition = isPathAhead(row, col, dir, grid);
          if (condition) {
            runBlock(block.children || [], depth + 1);
          } else if (block.elseChildren) {
            runBlock(block.elseChildren, depth + 1);
          }
          break;
        }
        case BLOCK_TYPES.IF_STAR: {
          const condition = grid[row][col] === CELL_TYPES.STAR;
          if (condition) {
            runBlock(block.children || [], depth + 1);
          } else if (block.elseChildren) {
            runBlock(block.elseChildren, depth + 1);
          }
          break;
        }
        default:
          break;
      }
    }
  }

  const structured = structureBlocks(blocks);
  runBlock(structured);

  const totalStars = countItemsInOriginal(level.grid, CELL_TYPES.STAR);
  const totalGems = countItemsInOriginal(level.grid, CELL_TYPES.GEM);

  return {
    steps,
    reachedGoal,
    starsCollected,
    gemsCollected,
    totalStars,
    totalGems,
    totalSteps,
    error,
    perfect: reachedGoal && starsCollected === totalStars && gemsCollected === totalGems,
  };
}

function countItemsInOriginal(grid, cellType) {
  let count = 0;
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c] === cellType) count++;
    }
  }
  return count;
}

export function structureBlocks(flatBlocks) {
  const result = [];
  let i = 0;

  while (i < flatBlocks.length) {
    const block = flatBlocks[i];

    if (block.type === BLOCK_TYPES.REPEAT) {
      const { body, nextIndex } = extractUntil(flatBlocks, i + 1, BLOCK_TYPES.END_REPEAT);
      result.push({ ...block, children: structureBlocks(body) });
      i = nextIndex;
    } else if (block.type === BLOCK_TYPES.IF_WALL || block.type === BLOCK_TYPES.IF_PATH || block.type === BLOCK_TYPES.IF_STAR) {
      const { body: ifBody, elseBody, nextIndex } = extractIfBlock(flatBlocks, i + 1);
      result.push({
        ...block,
        children: structureBlocks(ifBody),
        elseChildren: elseBody ? structureBlocks(elseBody) : null,
      });
      i = nextIndex;
    } else if (block.type === BLOCK_TYPES.END_REPEAT || block.type === BLOCK_TYPES.END_IF || block.type === BLOCK_TYPES.ELSE) {
      i++;
    } else {
      result.push(block);
      i++;
    }
  }

  return result;
}

function extractUntil(blocks, startIdx, endType) {
  const body = [];
  let depth = 1;
  let i = startIdx;

  while (i < blocks.length) {
    if (blocks[i].type === BLOCK_TYPES.REPEAT) depth++;
    if (blocks[i].type === endType) {
      depth--;
      if (depth === 0) return { body, nextIndex: i + 1 };
    }
    body.push(blocks[i]);
    i++;
  }
  return { body, nextIndex: i };
}

function extractIfBlock(blocks, startIdx) {
  const ifBody = [];
  let elseBody = null;
  let inElse = false;
  let depth = 1;
  let i = startIdx;

  while (i < blocks.length) {
    if (blocks[i].type === BLOCK_TYPES.IF_WALL || blocks[i].type === BLOCK_TYPES.IF_PATH || blocks[i].type === BLOCK_TYPES.IF_STAR) {
      depth++;
    }
    if (blocks[i].type === BLOCK_TYPES.END_IF) {
      depth--;
      if (depth === 0) return { body: ifBody, elseBody, nextIndex: i + 1 };
    }
    if (blocks[i].type === BLOCK_TYPES.ELSE && depth === 1) {
      inElse = true;
      elseBody = [];
      i++;
      continue;
    }
    if (inElse) {
      elseBody.push(blocks[i]);
    } else {
      ifBody.push(blocks[i]);
    }
    i++;
  }
  return { body: ifBody, elseBody, nextIndex: i };
}
