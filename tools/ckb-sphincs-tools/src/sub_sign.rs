use ckb_sphincs_utils::SphincsPlus;
use hex::encode;
use std::path::PathBuf;

fn hex_to_bytes(hex: &str) -> Vec<u8> {
    let hex = hex.trim_start_matches("0x"); // Remove "0x" prefix if present
    (0..hex.len())
        .step_by(2)
        .map(|i| u8::from_str_radix(&hex[i..i + 2], 16).expect("Invalid hex"))
        .collect()
}

pub fn sub_sign(key: SphincsPlus, message_file: PathBuf, signature_file: Option<PathBuf>) {
    // let data_to_sign = String::from_utf8(std::fs::read(message_file).expect("Read message failed")).unwrap();
    let hex_str = std::fs::read_to_string(message_file).expect("Read message failed");
    let data_to_sign = hex_to_bytes(&hex_str);
    let sign = key.sign(&data_to_sign);

    // println!(">>>data to sign: {:?}", data_to_sign);
    // println!("{:}", format!("0x{}", encode(&sign)));

    let data = format!("0x{}", encode(&sign));

    if let Some(file) = signature_file {
        std::fs::write(file, data).expect("write signature failed");
    }
}

