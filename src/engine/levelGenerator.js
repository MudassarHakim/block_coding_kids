import { CELL_TYPES, BLOCK_TYPES } from '../constants/blocks';

const P = CELL_TYPES.PATH;
const W = CELL_TYPES.WALL;
const S = CELL_TYPES.STAR;
const G = CELL_TYPES.GEM;
const WA = CELL_TYPES.WATER;
const LV = CELL_TYPES.LAVA;
const GL = CELL_TYPES.GOAL;
const ST = CELL_TYPES.START;

function makeLevelBase(id, worldId, title, grid, startRow, startCol, startDir, availableBlocks, optimalSteps, hint) {
  return { id, worldId, title, grid, startRow, startCol, startDir, availableBlocks, optimalSteps, hint };
}

function generateWorld1Levels() {
  const levels = [];
  const arrowsLR = [BLOCK_TYPES.MOVE_RIGHT];
  const arrowsRD = [BLOCK_TYPES.MOVE_RIGHT, BLOCK_TYPES.MOVE_DOWN];
  const arrows4 = [BLOCK_TYPES.MOVE_UP, BLOCK_TYPES.MOVE_DOWN, BLOCK_TYPES.MOVE_LEFT, BLOCK_TYPES.MOVE_RIGHT];

  levels.push(makeLevelBase(1, 1, 'First Steps', [
    [W, W, W, W, W],
    [W, ST, P, GL, W],
    [W, W, W, W, W],
  ], 1, 1, 1, arrowsLR, 2, 'Tap the → arrow to move right!'));

  levels.push(makeLevelBase(2, 1, 'A Bit Further', [
    [W, W, W, W, W, W],
    [W, ST, P, P, GL, W],
    [W, W, W, W, W, W],
  ], 1, 1, 1, arrowsLR, 3, 'Keep going right!'));

  levels.push(makeLevelBase(3, 1, 'Collect the Star', [
    [W, W, W, W, W],
    [W, ST, P, S, W],
    [W, W, W, GL, W],
    [W, W, W, W, W],
  ], 1, 1, 1, arrowsRD, 3, 'Go right to the star, then down to home!'));

  levels.push(makeLevelBase(4, 1, 'Going Down', [
    [W, W, W, W],
    [W, ST, W, W],
    [W, P, W, W],
    [W, GL, W, W],
    [W, W, W, W],
  ], 1, 1, 2, [BLOCK_TYPES.MOVE_DOWN], 2, 'Tap ↓ to go down!'));

  levels.push(makeLevelBase(5, 1, 'L-Shape', [
    [W, W, W, W, W],
    [W, ST, P, P, W],
    [W, W, W, P, W],
    [W, W, W, GL, W],
    [W, W, W, W, W],
  ], 1, 1, 1, arrowsRD, 4, 'Go right, then down!'));

  levels.push(makeLevelBase(6, 1, 'Diamond Path', [
    [W, W, W, W, W],
    [W, ST, G, P, W],
    [W, W, W, P, W],
    [W, W, W, GL, W],
    [W, W, W, W, W],
  ], 1, 1, 1, arrowsRD, 4, 'Collect the diamond on the way!'));

  levels.push(makeLevelBase(7, 1, 'Zigzag', [
    [W, W, W, W, W],
    [W, ST, W, W, W],
    [W, P, P, W, W],
    [W, W, P, W, W],
    [W, W, GL, W, W],
    [W, W, W, W, W],
  ], 1, 1, 2, arrowsRD, 5, 'Zigzag your way down!'));

  levels.push(makeLevelBase(8, 1, 'Star Path', [
    [W, W, W, W, W, W],
    [W, ST, S, P, S, W],
    [W, W, W, W, GL, W],
    [W, W, W, W, W, W],
  ], 1, 1, 1, arrowsRD, 5, 'Collect all stars!'));

  levels.push(makeLevelBase(9, 1, 'Two Turns', [
    [W, W, W, W, W],
    [W, ST, P, W, W],
    [W, W, P, W, W],
    [W, W, P, P, W],
    [W, W, W, GL, W],
    [W, W, W, W, W],
  ], 1, 1, 1, arrowsRD, 5, 'Use → and ↓ arrows!'));

  levels.push(makeLevelBase(10, 1, 'Diamond & Stars', [
    [W, W, W, W, W, W],
    [W, ST, S, G, S, W],
    [W, W, W, W, GL, W],
    [W, W, W, W, W, W],
  ], 1, 1, 1, arrowsRD, 5, 'Collect everything!'));

  levels.push(makeLevelBase(11, 1, 'Going Up', [
    [W, W, W, W, W],
    [W, W, W, GL, W],
    [W, W, W, P, W],
    [W, ST, P, P, W],
    [W, W, W, W, W],
  ], 3, 1, 1, [BLOCK_TYPES.MOVE_RIGHT, BLOCK_TYPES.MOVE_UP], 4, 'Try the ↑ arrow!'));

  levels.push(makeLevelBase(12, 1, 'Going Left', [
    [W, W, W, W, W],
    [W, GL, P, ST, W],
    [W, W, W, W, W],
  ], 1, 3, 3, [BLOCK_TYPES.MOVE_LEFT], 2, 'Try the ← arrow!'));

  levels.push(makeLevelBase(13, 1, 'All Directions', [
    [W, W, W, W, W],
    [W, P, GL, P, W],
    [W, P, W, P, W],
    [W, ST, P, G, W],
    [W, W, W, W, W],
  ], 3, 1, 1, arrows4, 4, 'Use all four arrows!'));

  levels.push(makeLevelBase(14, 1, 'U-Turn', [
    [W, W, W, W, W],
    [W, P, W, ST, W],
    [W, P, W, P, W],
    [W, GL, G, P, W],
    [W, W, W, W, W],
  ], 1, 3, 2, arrows4, 6, 'Go around the wall!'));

  levels.push(makeLevelBase(15, 1, 'Diamond Hunt', [
    [W, W, W, W, W, W],
    [W, ST, P, G, P, W],
    [W, W, W, W, P, W],
    [W, W, G, P, P, W],
    [W, W, GL, W, W, W],
    [W, W, W, W, W, W],
  ], 1, 1, 1, arrows4, 7, 'Find all diamonds!'));

  levels.push(makeLevelBase(16, 1, 'Corner Stars', [
    [W, W, W, W, W],
    [W, ST, P, S, W],
    [W, W, W, P, W],
    [W, S, G, GL, W],
    [W, W, W, W, W],
  ], 1, 1, 1, arrows4, 6, 'Stars and diamonds at corners!'));

  levels.push(makeLevelBase(17, 1, 'Meadow Walk', [
    [W, W, W, W, W, W, W],
    [W, ST, P, P, P, P, W],
    [W, W, W, W, W, P, W],
    [W, GL, G, P, G, P, W],
    [W, W, W, W, W, W, W],
  ], 1, 1, 1, arrows4, 10, 'A nice walk through the meadow!'));

  levels.push(makeLevelBase(18, 1, 'Three Gems', [
    [W, W, W, W, W],
    [W, ST, G, W, W],
    [W, W, P, W, W],
    [W, W, G, P, W],
    [W, W, W, G, W],
    [W, W, W, GL, W],
    [W, W, W, W, W],
  ], 1, 1, 1, arrows4, 7, 'Get all three gems!'));

  levels.push(makeLevelBase(19, 1, 'Crossroads', [
    [W, W, W, W, W, W],
    [W, W, P, W, W, W],
    [W, P, ST, P, W, W],
    [W, W, P, W, W, W],
    [W, W, GL, W, W, W],
    [W, W, W, W, W, W],
  ], 2, 2, 2, arrows4, 2, 'Which way will you go?'));

  levels.push(makeLevelBase(20, 1, 'Diamond Box', [
    [W, W, W, W, W, W, W],
    [W, W, W, ST, W, W, W],
    [W, W, P, P, P, W, W],
    [W, P, G, S, G, P, W],
    [W, W, P, P, P, W, W],
    [W, W, W, GL, W, W, W],
    [W, W, W, W, W, W, W],
  ], 1, 3, 2, arrows4, 4, 'Navigate the diamond box!'));

  levels.push(makeLevelBase(21, 1, 'Gem Path', [
    [W, W, W, W, W, W],
    [W, ST, G, P, G, W],
    [W, W, W, W, P, W],
    [W, W, W, W, GL, W],
    [W, W, W, W, W, W],
  ], 1, 1, 1, arrows4, 5, 'Collect the gems!'));

  levels.push(makeLevelBase(22, 1, 'Winding Road', [
    [W, W, W, W, W, W],
    [W, ST, P, W, W, W],
    [W, W, P, G, W, W],
    [W, W, W, P, P, W],
    [W, W, W, W, GL, W],
    [W, W, W, W, W, W],
  ], 1, 1, 1, arrows4, 6, 'Wind your way down!'));

  levels.push(makeLevelBase(23, 1, 'Star & Diamond', [
    [W, W, W, W, W],
    [W, ST, S, G, W],
    [W, W, W, P, W],
    [W, W, GL, P, W],
    [W, W, W, W, W],
  ], 1, 1, 1, arrows4, 5, 'Stars AND diamonds!'));

  levels.push(makeLevelBase(24, 1, 'Long Zigzag', [
    [W, W, W, W, W, W, W],
    [W, ST, P, P, W, W, W],
    [W, W, W, P, W, W, W],
    [W, W, G, P, W, W, W],
    [W, W, P, W, W, W, W],
    [W, W, P, G, GL, W, W],
    [W, W, W, W, W, W, W],
  ], 1, 1, 1, arrows4, 9, 'The biggest zigzag yet!'));

  levels.push(makeLevelBase(25, 1, 'Grasslands Boss', [
    [W, W, W, W, W, W, W],
    [W, ST, S, P, G, G, W],
    [W, W, W, P, W, W, W],
    [W, W, S, P, G, W, W],
    [W, W, W, P, W, W, W],
    [W, W, W, GL, W, W, W],
    [W, W, W, W, W, W, W],
  ], 1, 1, 1, arrows4, 8, 'Final Grasslands challenge!'));

  return levels;
}

function generateWorld2Levels() {
  const levels = [];
  const arrows4 = [BLOCK_TYPES.MOVE_UP, BLOCK_TYPES.MOVE_DOWN, BLOCK_TYPES.MOVE_LEFT, BLOCK_TYPES.MOVE_RIGHT];

  const maps = [
    { title:'Ocean Start', grid:[[W,W,W,W,W,W],[W,ST,P,P,P,W],[W,W,W,W,P,W],[W,W,W,W,GL,W],[W,W,W,W,W,W]], sr:1,sc:1,sd:1,opt:5,hint:'Dive into the ocean!' },
    { title:'Coral Path', grid:[[W,W,W,W,W,W],[W,ST,P,W,W,W],[W,W,P,W,W,W],[W,W,P,G,GL,W],[W,W,W,W,W,W]], sr:1,sc:1,sd:1,opt:5,hint:'Swim past the coral!' },
    { title:'Treasure Dive', grid:[[W,W,W,W,W,W],[W,ST,P,G,W,W],[W,W,W,P,W,W],[W,W,W,P,W,W],[W,W,W,GL,W,W],[W,W,W,W,W,W]], sr:1,sc:1,sd:1,opt:5,hint:'Dive deep for treasure!' },
    { title:'Wave Rider', grid:[[W,W,W,W,W,W,W],[W,ST,P,P,W,W,W],[W,W,W,P,G,W,W],[W,W,W,W,P,P,W],[W,W,W,W,W,GL,W],[W,W,W,W,W,W,W]], sr:1,sc:1,sd:1,opt:7,hint:'Ride the waves!' },
    { title:'Shell Collect', grid:[[W,W,W,W,W,W],[W,ST,S,G,P,W],[W,W,W,W,P,W],[W,W,G,P,P,W],[W,W,GL,W,W,W],[W,W,W,W,W,W]], sr:1,sc:1,sd:1,opt:7,hint:'Collect shells and gems!' },
    { title:'Deep Sea', grid:[[W,W,W,W,W],[W,ST,P,W,W],[W,W,P,W,W],[W,W,P,G,W],[W,W,W,P,W],[W,W,W,GL,W],[W,W,W,W,W]], sr:1,sc:1,sd:1,opt:6,hint:'Go deeper!' },
    { title:'Seahorse Trail', grid:[[W,W,W,W,W,W,W],[W,ST,P,G,P,S,W],[W,W,W,W,W,P,W],[W,GL,G,P,P,P,W],[W,W,W,W,W,W,W]], sr:1,sc:1,sd:1,opt:10,hint:'Follow the seahorse!' },
    { title:'Reef Maze', grid:[[W,W,W,W,W,W],[W,ST,P,W,P,W],[W,W,P,W,P,W],[W,W,P,G,P,W],[W,W,W,W,GL,W],[W,W,W,W,W,W]], sr:1,sc:1,sd:1,opt:7,hint:'Navigate the reef!' },
    { title:'Whirlpool', grid:[[W,W,W,W,W,W],[W,P,P,G,W,W],[W,P,W,P,W,W],[W,ST,W,GL,W,W],[W,W,W,W,W,W]], sr:3,sc:1,sd:0,opt:6,hint:'Avoid the whirlpool!' },
    { title:'Anchor Drop', grid:[[W,W,W,W,W],[W,ST,W,W,W],[W,P,W,W,W],[W,P,G,P,W],[W,W,W,P,W],[W,W,W,GL,W],[W,W,W,W,W]], sr:1,sc:1,sd:2,opt:6,hint:'Drop anchor at the goal!' },
    { title:'Pearl Path', grid:[[W,W,W,W,W,W],[W,ST,G,P,W,W],[W,W,W,P,W,W],[W,GL,G,P,W,W],[W,W,W,W,W,W]], sr:1,sc:1,sd:1,opt:5,hint:'Find the pearls!' },
    { title:'Starfish', grid:[[W,W,W,W,W,W],[W,W,S,W,W,W],[W,S,ST,G,W,W],[W,W,P,W,W,W],[W,W,GL,W,W,W],[W,W,W,W,W,W]], sr:2,sc:2,sd:2,opt:2,hint:'A starfish shape!' },
    { title:'Submarine', grid:[[W,W,W,W,W,W,W],[W,ST,P,G,P,P,W],[W,P,W,W,W,P,W],[W,GL,G,P,P,P,W],[W,W,W,W,W,W,W]], sr:1,sc:1,sd:1,opt:10,hint:'Circle like a submarine!' },
    { title:'Jellyfish', grid:[[W,W,W,W,W,W],[W,ST,P,G,W,W],[W,W,W,P,P,W],[W,GL,G,P,W,W],[W,W,W,W,W,W]], sr:1,sc:1,sd:1,opt:6,hint:'Float like a jellyfish!' },
    { title:'Dolphin Jump', grid:[[W,W,W,W,W,W,W],[W,ST,P,W,P,GL,W],[W,W,P,G,P,W,W],[W,W,W,W,W,W,W]], sr:1,sc:1,sd:1,opt:6,hint:'Jump like a dolphin!' },
    { title:'Tidal Wave', grid:[[W,W,W,W,W,W],[W,ST,P,G,W,W],[W,W,W,P,W,W],[W,W,P,P,W,W],[W,W,P,W,W,W],[W,W,GL,W,W,W],[W,W,W,W,W,W]], sr:1,sc:1,sd:1,opt:8,hint:'Ride the tidal wave!' },
    { title:'Octopus Arms', grid:[[W,W,W,W,W,W,W],[W,W,P,W,G,W,W],[W,P,ST,P,P,P,W],[W,W,P,W,W,GL,W],[W,W,W,W,W,W,W]], sr:2,sc:2,sd:1,opt:4,hint:'Like an octopus!' },
    { title:'Sunken Ship', grid:[[W,W,W,W,W,W],[W,ST,P,G,G,W],[W,W,W,W,P,W],[W,W,G,P,P,W],[W,W,GL,W,W,W],[W,W,W,W,W,W]], sr:1,sc:1,sd:1,opt:7,hint:'Explore the sunken ship!' },
    { title:'Kelp Forest', grid:[[W,W,W,W,W,W,W],[W,ST,P,W,G,P,W],[W,W,P,W,P,W,W],[W,W,P,G,P,W,W],[W,W,W,W,GL,W,W],[W,W,W,W,W,W,W]], sr:1,sc:1,sd:1,opt:8,hint:'Swim through the kelp!' },
    { title:'Bubble Trail', grid:[[W,W,W,W,W,W],[W,ST,S,G,W,W],[W,W,W,P,W,W],[W,W,P,P,W,W],[W,W,G,S,W,W],[W,W,GL,W,W,W],[W,W,W,W,W,W]], sr:1,sc:1,sd:1,opt:8,hint:'Follow the bubbles!' },
    { title:'Shark Dodge', grid:[[W,W,W,W,W,W,W],[W,ST,P,G,P,P,W],[W,W,W,W,W,P,W],[W,W,W,W,W,P,W],[W,GL,G,P,P,P,W],[W,W,W,W,W,W,W]], sr:1,sc:1,sd:1,opt:12,hint:'Dodge the sharks!' },
    { title:'Coral Reef', grid:[[W,W,W,W,W,W],[W,ST,P,G,W,W],[W,W,W,P,P,W],[W,W,S,P,GL,W],[W,W,W,W,W,W]], sr:1,sc:1,sd:1,opt:6,hint:'Beautiful coral reef!' },
    { title:'Fish School', grid:[[W,W,W,W,W,W],[W,ST,P,G,P,W],[W,W,W,W,P,W],[W,W,P,G,P,W],[W,W,P,W,W,W],[W,W,GL,W,W,W],[W,W,W,W,W,W]], sr:1,sc:1,sd:1,opt:9,hint:'Swim with the fish!' },
    { title:'Treasure Chest', grid:[[W,W,W,W,W,W,W],[W,ST,S,G,S,G,W],[W,W,W,W,W,P,W],[W,GL,G,P,G,P,W],[W,W,W,W,W,W,W]], sr:1,sc:1,sd:1,opt:10,hint:'Find the treasure!' },
    { title:'Ocean Boss', grid:[[W,W,W,W,W,W,W],[W,ST,P,G,S,P,W],[W,W,W,W,W,P,W],[W,W,S,G,P,P,W],[W,W,P,W,W,W,W],[W,W,P,G,G,GL,W],[W,W,W,W,W,W,W]], sr:1,sc:1,sd:1,opt:14,hint:'Defeat the ocean boss!' },
  ];

  maps.forEach((m, i) => {
    levels.push(makeLevelBase(26 + i, 2, m.title, m.grid, m.sr, m.sc, m.sd, arrows4, m.opt, m.hint));
  });
  return levels;
}

function generateWorld3Levels() {
  const levels = [];
  const blocks = [BLOCK_TYPES.MOVE_UP, BLOCK_TYPES.MOVE_DOWN, BLOCK_TYPES.MOVE_LEFT, BLOCK_TYPES.MOVE_RIGHT];

  const maps = [
    { title:'Loop Intro', grid:[[W,W,W,W,W,W,W,W],[W,ST,P,P,P,P,GL,W],[W,W,W,W,W,W,W,W]], sr:1,sc:1,sd:1,opt:2,hint:'Use Repeat to move 5 times!' },
    { title:'Straight Line', grid:[[W,W,W,W,W,W,W,W,W],[W,ST,P,P,P,P,P,GL,W],[W,W,W,W,W,W,W,W,W]], sr:1,sc:1,sd:1,opt:2,hint:'Repeat → arrow!' },
    { title:'Star Line', grid:[[W,W,W,W,W,W,W,W],[W,ST,S,G,S,G,GL,W],[W,W,W,W,W,W,W,W]], sr:1,sc:1,sd:1,opt:2,hint:'Stars and diamonds along a line!' },
    { title:'Loop Corner', grid:[[W,W,W,W,W,W],[W,ST,P,P,P,W],[W,W,W,W,P,W],[W,W,W,W,P,W],[W,W,W,W,GL,W],[W,W,W,W,W,W]], sr:1,sc:1,sd:1,opt:4,hint:'Loop right then loop down!' },
    { title:'Square Walk', grid:[[W,W,W,W,W,W],[W,ST,P,P,P,W],[W,W,W,W,P,W],[W,W,W,W,P,W],[W,W,GL,G,P,W],[W,W,W,W,W,W]], sr:1,sc:1,sd:1,opt:6,hint:'Walk in a square!' },
    { title:'Repeat Down', grid:[[W,W,W,W,W,W],[W,ST,P,G,W,W],[W,W,W,P,W,W],[W,W,W,P,G,W],[W,W,W,W,GL,W],[W,W,W,W,W,W]], sr:1,sc:1,sd:1,opt:4,hint:'Repeat: → then ↓!' },
    { title:'Loop Gems', grid:[[W,W,W,W,W,W,W,W],[W,ST,G,G,G,G,GL,W],[W,W,W,W,W,W,W,W]], sr:1,sc:1,sd:1,opt:2,hint:'Collect all gems with a loop!' },
    { title:'Staircase', grid:[[W,W,W,W,W,W],[W,ST,P,W,W,W],[W,W,P,G,W,W],[W,W,W,P,P,W],[W,W,W,W,GL,W],[W,W,W,W,W,W]], sr:1,sc:1,sd:1,opt:4,hint:'Go down the stairs with loops!' },
    { title:'Desert Sprint', grid:[[W,W,W,W,W,W,W,W,W,W],[W,ST,G,P,G,P,G,P,GL,W],[W,W,W,W,W,W,W,W,W,W]], sr:1,sc:1,sd:1,opt:2,hint:'Sprint across the desert!' },
    { title:'Cactus Path', grid:[[W,W,W,W,W,W],[W,ST,P,G,P,W],[W,W,W,W,P,W],[W,GL,G,P,P,W],[W,W,W,W,W,W]], sr:1,sc:1,sd:1,opt:6,hint:'Avoid the cacti!' },
    { title:'Oasis', grid:[[W,W,W,W,W,W,W],[W,ST,P,G,S,P,W],[W,W,W,W,W,P,W],[W,GL,G,P,G,P,W],[W,W,W,W,W,W,W]], sr:1,sc:1,sd:1,opt:6,hint:'Find the oasis!' },
    { title:'Sand Dunes', grid:[[W,W,W,W,W,W,W,W],[W,ST,P,W,G,P,W,W],[W,W,P,W,P,W,W,W],[W,W,P,G,P,W,W,W],[W,W,W,W,GL,W,W,W],[W,W,W,W,W,W,W,W]], sr:1,sc:1,sd:1,opt:6,hint:'Over the sand dunes!' },
    { title:'Pyramid Step', grid:[[W,W,W,W,W,W,W],[W,ST,P,W,W,W,W],[W,W,P,G,W,W,W],[W,W,W,P,P,W,W],[W,W,W,W,P,G,W],[W,W,W,W,W,GL,W],[W,W,W,W,W,W,W]], sr:1,sc:1,sd:1,opt:4,hint:'Climb the pyramid!' },
    { title:'Mirage', grid:[[W,W,W,W,W,W,W],[W,ST,P,G,P,P,W],[W,P,W,W,W,P,W],[W,GL,G,P,G,P,W],[W,W,W,W,W,W,W]], sr:1,sc:1,sd:1,opt:6,hint:'Is it a mirage?' },
    { title:'Scarab Trail', grid:[[W,W,W,W,W,W,W,W],[W,ST,G,P,G,P,G,W],[W,W,W,W,W,W,GL,W],[W,W,W,W,W,W,W,W]], sr:1,sc:1,sd:1,opt:3,hint:'Follow the scarabs!' },
    { title:'Double Loop', grid:[[W,W,W,W,W,W],[W,ST,P,G,P,W],[W,W,W,W,P,W],[W,W,W,W,P,W],[W,W,W,W,P,W],[W,W,W,W,GL,W],[W,W,W,W,W,W]], sr:1,sc:1,sd:1,opt:4,hint:'Two loops in one!' },
    { title:'Sand Snake', grid:[[W,W,W,W,W,W,W],[W,ST,P,G,P,W,W],[W,W,W,W,P,W,W],[W,W,G,P,P,W,W],[W,W,P,W,W,W,W],[W,W,P,G,GL,W,W],[W,W,W,W,W,W,W]], sr:1,sc:1,sd:1,opt:8,hint:'Slither like a snake!' },
    { title:'Tomb Entry', grid:[[W,W,W,W,W,W],[W,ST,P,G,S,W],[W,W,W,W,P,W],[W,W,S,G,P,W],[W,W,GL,W,W,W],[W,W,W,W,W,W]], sr:1,sc:1,sd:1,opt:7,hint:'Enter the tomb!' },
    { title:'Loop Practice', grid:[[W,W,W,W,W,W,W],[W,ST,P,G,P,P,W],[W,W,W,W,W,P,W],[W,W,W,W,W,P,W],[W,W,W,W,W,GL,W],[W,W,W,W,W,W,W]], sr:1,sc:1,sd:1,opt:4,hint:'Practice your loops!' },
    { title:'Desert Cross', grid:[[W,W,W,W,W,W,W],[W,W,W,G,W,W,W],[W,W,W,P,W,W,W],[W,G,P,ST,P,G,W],[W,W,W,P,W,W,W],[W,W,W,GL,W,W,W],[W,W,W,W,W,W,W]], sr:3,sc:3,sd:2,opt:2,hint:'A desert crossroads!' },
    { title:'Camel Ride', grid:[[W,W,W,W,W,W,W,W],[W,ST,G,P,G,P,P,W],[W,W,W,W,W,W,P,W],[W,GL,G,P,G,P,P,W],[W,W,W,W,W,W,W,W]], sr:1,sc:1,sd:1,opt:6,hint:'Ride the camel!' },
    { title:'Sandstorm', grid:[[W,W,W,W,W,W],[W,ST,P,G,P,W],[W,W,W,W,P,W],[W,W,G,S,P,W],[W,W,GL,W,W,W],[W,W,W,W,W,W]], sr:1,sc:1,sd:1,opt:7,hint:'Brave the sandstorm!' },
    { title:'Pharaoh Path', grid:[[W,W,W,W,W,W,W],[W,ST,P,G,G,W,W],[W,W,W,W,P,W,W],[W,W,W,W,P,G,W],[W,W,W,W,W,P,W],[W,W,W,W,W,GL,W],[W,W,W,W,W,W,W]], sr:1,sc:1,sd:1,opt:7,hint:'Walk the pharaoh path!' },
    { title:'Sphinx Riddle', grid:[[W,W,W,W,W,W,W,W],[W,ST,S,G,S,G,S,W],[W,W,W,W,W,W,P,W],[W,GL,G,P,G,P,P,W],[W,W,W,W,W,W,W,W]], sr:1,sc:1,sd:1,opt:6,hint:'Solve the sphinx riddle!' },
    { title:'Desert Boss', grid:[[W,W,W,W,W,W,W,W],[W,ST,P,G,P,G,S,W],[W,W,W,W,W,W,P,W],[W,W,G,P,G,P,P,W],[W,W,P,W,W,W,W,W],[W,W,P,G,G,GL,W,W],[W,W,W,W,W,W,W,W]], sr:1,sc:1,sd:1,opt:10,hint:'Defeat the desert boss!' },
  ];

  maps.forEach((m, i) => {
    levels.push(makeLevelBase(51 + i, 3, m.title, m.grid, m.sr, m.sc, m.sd, blocks, m.opt, m.hint));
  });
  return levels;
}

function generateWorld4to8Levels() {
  const levels = [];

  const moveBlocks = [BLOCK_TYPES.MOVE_UP, BLOCK_TYPES.MOVE_DOWN, BLOCK_TYPES.MOVE_LEFT, BLOCK_TYPES.MOVE_RIGHT];
  const ifBlocks = [...moveBlocks, BLOCK_TYPES.IF_WALL, BLOCK_TYPES.IF_PATH, BLOCK_TYPES.ELSE, BLOCK_TYPES.END_IF];
  const allBlocks = [...ifBlocks, BLOCK_TYPES.IF_STAR];

  const worldConfigs = [
    { id: 4, startLevel: 76, blocks: moveBlocks, name: 'Forest' },
    { id: 5, startLevel: 101, blocks: ifBlocks, name: 'Mountains' },
    { id: 6, startLevel: 126, blocks: ifBlocks, name: 'Space' },
    { id: 7, startLevel: 151, blocks: allBlocks, name: 'Volcano' },
    { id: 8, startLevel: 176, blocks: allBlocks, name: 'Crystal Cave' },
  ];

  const levelNames = {
    4: ['Tall Trees','Mossy Path','Woodland Trail','Fern Valley','Pine Ridge','Oak Bridge','Ivy Walk','Mushroom Glen','Fox Den','Bear Trail','Bird Song','Acorn Hunt','Leaf Fall','Root Bridge','Forest Lake','Willow Way','Cedar Pass','Bark Path','Deer Run','Squirrel Chase','Owl Eyes','Honey Tree','Dark Woods','Ancient Oak','Forest Boss'],
    5: ['Base Camp','Rocky Start','Boulder Path','Cliff Edge','Peak View','Snow Drift','Eagle Nest','Crystal Stream','Cave Mouth','Ridge Walk','Summit Push','Cloud Walk','Goat Trail','Wind Pass','Ice Bridge','Alpine Meadow','Crevasse Jump','Echo Point','Mountain Lake','Storm Peak','Frost Bite','Granite Stairs','Thin Air','Final Ascent','Mountain Boss'],
    6: ['Launch Pad','Orbit Entry','Star Dust','Asteroid Belt','Moon Walk','Saturn Rings','Nebula Drift','Comet Tail','Galaxy Spin','Black Hole Edge','Space Walk','Mars Landing','Jupiter Fly','Venus Glow','Alien Signal','Wormhole','Light Speed','Gravity Pull','Solar Wind','Star Gate','Deep Space','Meteor Shower','Constellation','Universe End','Space Boss'],
    7: ['Magma Flow','Ash Rain','Hot Springs','Lava Bridge','Smoke Signal','Eruption Path','Crystal Form','Obsidian Wall','Ember Trail','Fire Walk','Sulphur Lake','Vent Climb','Magma Chamber','Igneous Path','Basalt Bridge','Pyroclast','Thermal Rise','Caldera Edge','Inferno Gate','Lava Tube','Cinder Cone','Pumice Trail','Geode Cave','Core Access','Volcano Boss'],
    8: ['Crystal Entry','Amethyst Path','Quartz Tunnel','Sapphire Room','Ruby Chamber','Emerald Hall','Diamond Corridor','Topaz Bridge','Opal Cavern','Garnet Pass','Jade Garden','Citrine Lake','Pearl Drop','Tourmaline Twist','Zircon Maze','Moonstone Mirror','Onyx Depths','Aquamarine Pool','Tanzanite Trail','Alexandrite Shift','Bismuth Stairs','Fluorite Glow','Malachite Maze','Platinum Path','Crystal Boss'],
  };

  for (const wc of worldConfigs) {
    for (let i = 0; i < 25; i++) {
      const levelId = wc.startLevel + i;
      const complexity = Math.floor(i / 5) + 3;
      const gridSize = Math.min(4 + Math.floor(i / 4), 8);

      const g = Array.from({ length: gridSize + 2 }, () => Array(gridSize + 2).fill(W));

      let cr = 1, cc = 1;
      g[cr][cc] = ST;
      const path = [{ r: cr, c: cc }];
      const directions = [[0,1],[1,0],[0,-1],[-1,0]];

      const seed = levelId * 137 + wc.id * 31;
      let rng = seed;
      const rand = () => { rng = (rng * 1103515245 + 12345) & 0x7fffffff; return rng; };

      for (let step = 0; step < complexity * 2 + i; step++) {
        const possible = directions.filter(([dr, dc]) => {
          const nr = cr + dr, nc = cc + dc;
          return nr >= 1 && nr <= gridSize && nc >= 1 && nc <= gridSize && g[nr][nc] === W;
        });
        if (possible.length === 0) break;
        const [dr, dc] = possible[rand() % possible.length];
        cr += dr; cc += dc;
        const cellRand = rand() % 10;
        if (cellRand < 2 && i > 2) g[cr][cc] = G;
        else if (cellRand < 3 && i > 5) g[cr][cc] = S;
        else g[cr][cc] = P;
        path.push({ r: cr, c: cc });
      }
      g[cr][cc] = GL;

      if (i > 2) {
        const mid = Math.floor(path.length / 2);
        if (path[mid] && g[path[mid].r][path[mid].c] === P) {
          g[path[mid].r][path[mid].c] = G;
        }
      }
      if (i > 6) {
        const q = Math.floor(path.length / 4);
        if (path[q] && g[path[q].r][path[q].c] === P) {
          g[path[q].r][path[q].c] = G;
        }
      }

      const title = levelNames[wc.id][i] || `Level ${levelId}`;
      const opt = Math.max(path.length - 1, 2);
      const hints = [
        'Use arrows to navigate!','Plan your route first!','Collect all diamonds!',
        'Try using repeat!','Watch out for walls!','Think step by step!',
        'Combine arrows wisely!','Use repeat for patterns!',
      ];

      levels.push(makeLevelBase(levelId, wc.id, title, g, 1, 1, 1, wc.blocks, opt, hints[rand() % hints.length]));
    }
  }

  return levels;
}

export function generateAllLevels() {
  return [
    ...generateWorld1Levels(),
    ...generateWorld2Levels(),
    ...generateWorld3Levels(),
    ...generateWorld4to8Levels(),
  ];
}
