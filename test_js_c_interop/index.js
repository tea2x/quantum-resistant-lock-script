import { slh_dsa_shake_128f } from "@noble/post-quantum/slh-dsa";
import { promises as fs } from "fs";

/**
 * Reads a file and converts its hex content to a Uint8Array.
 * @param {string} path - Path to the hex file.
 * @returns {Promise<Uint8Array>} - Parsed byte array.
 */
async function readHexFileAsBytes(path) {
  try {
    const content = await fs.readFile(path, "utf-8");
    const hexString = content.trim().replace(/^0x/, ""); // Remove "0x" if present
    return new Uint8Array(
      hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
    );
  } catch (error) {
    console.error("Error reading signature file:", error);
    throw error;
  }
}

/**
 * Reads and parses a JSON file containing public and private keys.
 * @param {string} filePath - Path to the JSON file.
 * @returns {Promise<{publicKey: Uint8Array, secretKey: Uint8Array}>} - Parsed keys.
 */
async function readKeysFromJson(filePath) {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    const { pubkey, prikey } = JSON.parse(data);
    return {
      publicKey: new Uint8Array(pubkey),
      secretKey: new Uint8Array(prikey),
    };
  } catch (error) {
    console.error("Error reading keys from JSON:", error);
    throw error;
  }
}

/**
 * Extracts the signature and message from the imported signature file.
 * @param {Uint8Array} sphincs_signature - Raw imported signature bytes.
 * @returns {{ signature: Uint8Array, message: Uint8Array }} - Separated signature and message.
 */
function extractSignatureAndMessage(sphincs_signature) {
  const messageLength = 32;
  return {
    signature: sphincs_signature.slice(0, -messageLength),
    message: sphincs_signature.slice(-messageLength),
  };
}

/**
 * Writes a Uint8Array as a hex string to a file.
 * @param {Uint8Array} data - The data to write.
 * @param {string} filePath - The path to the file.
 * @returns {Promise<void>} - A promise that resolves when the file is written.
 */
async function writeHexToFile(data, filePath) {
  const hexString = Buffer.from(data).toString("hex");
  await fs.writeFile(filePath, hexString, "utf8");
}

/**
 * Converts a Uint8Array to a hexadecimal string.
 *
 * @param {Uint8Array} uint8Array - The array of bytes to convert.
 * @returns {string} The hexadecimal representation of the input array.
 */
function toHexString(uint8Array) {
  return Array.from(uint8Array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Before testing
const originalMessage = await readHexFileAsBytes("./message.txt");
const keys = await readKeysFromJson("./key.json");
console.log("\n\n\n*************************** MESSAGE AND KEYS ****************************");
console.log(">>> Original message: ", originalMessage.toString());
console.log(">>> Public key: ", keys.publicKey.toString());
console.log(">>> Private key: ", keys.secretKey.toString());
console.log("*************************************************************************");


async function testcase1() {
  console.log("\n\n\n****************** NOBLE VERIFYING SPHINCS+C SIGNATURE ******************");
  const sphincs_signature = await readHexFileAsBytes("./sphincs_signature.txt");
  // console.log(">>> Signature by sphincs+ ref: ", sphincs_signature);
  const { signature, message } = extractSignatureAndMessage(sphincs_signature);
  console.log(">>> Detached message (sig[-32bytes]): ", message.toString());
  const isValid = slh_dsa_shake_128f.verify(keys.publicKey, message, signature);
  console.log(">>> Result: ", isValid);
  console.log("*************************************************************************");
}

async function testcase2() {
  console.log("\n\n\n****************************** NOBLE SIGN *******************************");
  const noblesignature = slh_dsa_shake_128f.sign(keys.secretKey, originalMessage);
  const combinedData = Buffer.concat([noblesignature, originalMessage]);
  await writeHexToFile(combinedData, "./noble_signature.txt")
  console.log("*************************************************************************");
}

async function main() {
  await testcase1();
  await testcase2();
}

// Main execution
main();
