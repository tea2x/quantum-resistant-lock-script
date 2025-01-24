cd tools/ckb-sphincs-tools/

cargo run -- gen-key ../../test_js_c_interop/key.json

cargo run sign --message_file ../../test_js_c_interop/message.txt  --key_file ../../test_js_c_interop/key.json --signature_path ../../test_js_c_interop/signature.txt
