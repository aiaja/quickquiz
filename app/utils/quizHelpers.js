/**
 * Decodes URL-encoded strings (opentdb.com uses url3986 encoding)
 */
export const htmlDecode = (str) => {
  try {
    return decodeURIComponent(str);
  } catch (error) {
    console.error("htmlDecode failed:", error);
    return str;
  }
};

/**
 * Shuffles an array using the Fisher-Yates algorithm
 */
export const shuffle = (array) => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

/**
 * Calculates quiz statistics
 */

export const calculateScore = (
  answers,
  questions,
  totalTimeInSeconds,
  timeRemainingInSeconds,
) => {
  const stats = answers.reduce(
    (acc, answer, index) => {
      if (answer === null) {
        acc.unanswered++;
      } else if (answer === questions[index].correctAnswer) {
        acc.correct++;
      } else {
        acc.wrong++;
      }
      return acc;
    },
    { correct: 0, wrong: 0, unanswered: 0 },
  );

  const total = questions.length;
  const percentage = Math.round((stats.correct / total) * 100);
  const timeSpent = totalTimeInSeconds - timeRemainingInSeconds;
  const minutes = Math.floor(timeSpent / 60);
  const seconds = timeSpent % 60;
  const duration = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  return {
    ...stats,
    total,
    percentage,
    duration,
  };
};
