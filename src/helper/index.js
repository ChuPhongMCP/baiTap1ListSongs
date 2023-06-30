import { random } from "lodash";

export const formatTime = (timeInSeconds) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export const getRamdom = (min, max, omittedNumber) => {
  let randomNumber;
  do {
    randomNumber = random(min, max);
  } while (randomNumber === omittedNumber);
  return randomNumber;
};
