export type PlayerRank = {
  level: number;
  title: string;
};

export const getRankFromExp = (exp: number): PlayerRank => {
  const safeExp = Number.isFinite(exp) ? Math.max(0, Math.floor(exp)) : 0;

  // Simple curve: every 500 EXP => +1 level
  const level = Math.max(1, Math.floor(safeExp / 500) + 1);

  // Titles at milestones
  let title = "Scout";
  if (level >= 10) title = "Legend";
  else if (level >= 5) title = "Warrior";
  else if (level >= 3) title = "Fighter";

  return { level, title };
};
