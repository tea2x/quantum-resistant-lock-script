use ckb_sphincs_utils::SphincsPlus;
use std::path::PathBuf;

fn hex_to_bytes(hex: &str) -> Vec<u8> {
    let hex = hex.trim_start_matches("0x"); // Remove "0x" prefix if present
    (0..hex.len())
        .step_by(2)
        .map(|i| u8::from_str_radix(&hex[i..i + 2], 16).expect("Invalid hex"))
        .collect()
}

pub fn sub_verify(key: SphincsPlus, message_file: PathBuf, signature_file: PathBuf) {
    let hex_str = std::fs::read_to_string(message_file).expect("Read message failed");
    let message = hex_to_bytes(&hex_str);

    let hex_str = std::fs::read_to_string(signature_file).expect("Read signature failed");
    let signature = hex_to_bytes(&hex_str);

    let verif = key.verify(&message, &signature);

    match verif {
      Ok(_) => println!("Signature verification successful"),
      Err(error_code) => println!("Signature verification failed with error code: {}", error_code),
  }
}

