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
cargo run -- gen-key ../../test_js_c_interop/key.json

# Sign the message using sphinc+ reference implementation
cargo run -- sign --message_file ../../test_js_c_interop/message.txt --key_file ../../test_js_c_interop/key.json --signature_path ../../test_js_c_interop/signature.txt

# Verify using Node.js
cd ../../test_js_c_interop || exit
npm install
node index.js
