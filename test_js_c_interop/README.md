#### 0. clone
```shell
git clone --recurse-submodules https://github.com/tea2x/quantum-resistant-lock-script.git
git checkout test-interoperability
```

#### 1. compile sphincs and tools in the main DIR
```shell
make all-via-docker
cargo build
```

#### 2. gen key and sign message by the C implementation of sphincs+
```shell
cd tools/ckb-sphincs-tools/
cargo run -- gen-key ../../test_js_c_interop/key.json
cargo run sign --message_file ../../test_js_c_interop/message.txt  --key_file ../../test_js_c_interop/key.json --signature_path ../../test_js_c_interop/signature.txt
```

#### 3. key and signature is output in the /test_js_c_interop folder

#### 4. go to /test_js_c_interop and use noble/sphincs to verify the signature

```shell
nmp install
node index.js
```