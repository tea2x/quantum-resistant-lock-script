#!/bin/bash

# Navigate to the project directory
cd ../ || exit

# Ensure submodules are updated
git submodule update --init --recursive

# Compile using make and docker
make all-via-docker
cargo build

# Generate keys using sphinc+ reference implementation
cd tools/ckb-sphincs-tools || exit

echo -e "\n\n\n######################## SPHINCS+C GEN KEY ########################"
cargo run -- gen-key ../../test_js_c_interop/key.json
echo "######################################################################"

# Sign the message using sphinc+ reference implementation
echo -e "\n\n\n######################## SPHINCS+C SIGN ########################"
cargo run -- sign --message_file ../../test_js_c_interop/message.txt --key_file ../../test_js_c_interop/key.json --signature_file ../../test_js_c_interop/sphincs_signature.txt
echo "######################################################################"

# Verify using Node.js
cd ../../test_js_c_interop || exit
npm install
# in index.js, noble quantum produces a noble signature with the same key and same message
node index.js

# Sphincs+ verifying noble sigature
cd ../tools/ckb-sphincs-tools || exit
echo -e "\n\n\n######################## SPHINCS+C VERIFY NOBLE SIGNATURE ########################"
cargo run verify --key_file ../../test_js_c_interop/key.json --message_file ../../test_js_c_interop/message.txt --signature_file ../../test_js_c_interop/noble_signature.txt
echo "######################################################################"
