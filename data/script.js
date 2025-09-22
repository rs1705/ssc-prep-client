const fs = require("fs");

// Load datasets
const oldVocab = require("./oldVocab.json");      // old dataset with { word, type }
const newDataset = require("./newDataset.json");  // new dataset with { front: { text }, type }

// Create a Set for quick lookup of new dataset words
const newWordsSet = new Set(
  newDataset.map(card => card.front?.text?.trim().toLowerCase()).filter(Boolean)
);

// Filter old vocab for words not in new dataset
const unmatched = oldVocab.filter(oldCard => {
  const word = oldCard.word?.trim().toLowerCase();
  return word && !newWordsSet.has(word);
});

// Output unmatched words
console.log(`Unmatched words: ${unmatched.length}`);
console.log(unmatched);

// Save to a new JSON file
fs.writeFileSync("unmatchedOldVocab.json", JSON.stringify(unmatched, null, 2));
