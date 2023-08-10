const express = require('express');
const verifyProof = require('../utils/verifyProof');
const niceList = require('../utils/niceList.json');
const MerkleTree = require('../utils/MerkleTree');

const port = 1225;

const app = express();
app.use(express.json());

// TODO: hardcode a merkle root here representing the whole nice list
// create the merkle tree for the whole nice list
const merkleTree = new MerkleTree(niceList);

// get the root
const MERKLE_ROOT = merkleTree.getRoot();
function getStringSizeInBytes(str) {
  const encoder = new TextEncoder();
  const byteArray = encoder.encode(str);
  return byteArray.length;
}
console.log(getStringSizeInBytes(MERKLE_ROOT))
app.post('/gift', (req, res) => {
  // grab the parameters from the front-end here
  const body = req.body;

  // TODO: prove that a name is in the list 
  let isInTheList = false;
  isInTheList = verifyProof(body.proof, body.name, MERKLE_ROOT);
  console.log(isInTheList)
  if (isInTheList) {
    res.send("You got a toy robot!");
  }
  else {
    res.send("You are not on the list :(");
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
