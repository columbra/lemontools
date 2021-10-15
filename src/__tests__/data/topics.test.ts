import { topics } from "../../data/topics";
const value = topics[Math.floor(Math.random() * topics.length)];
test("All topics are ASCII characters", () => {
  /**
   * @author Magnus (on Regexr.com)
   * regex by Magnus on Regexr.com
   */
  const regex = /[^\x00-\x7F]+\ *(?:[^\x00-\x7F]| )*/; // match non ascii

  topics.forEach((e) => {
    const matches = regex.test(e);
    expect(matches).toBeFalsy();
  });
});
