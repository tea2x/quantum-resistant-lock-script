
## SPHINCS+ Lock Implementation Strategy

We evaluated three different technical approaches for implementing the SPHINCS+ lock with the goal of selecting the most secure and stable version for long-term deployment.

### The Three Implementation Versions

The following three versions were created to compare trade-offs in cryptographic assurance, performance, and long-term maintenance:

| Version | Core SPHINCS+ Logic | CKB Glue Code | Key Technology |
| :--- | :--- | :--- | :--- |
| **1. Pure C** | `sphincsplus` C library (NIST reference) | C99 Standard | High cryptographic assurance and stability. |
| **2. Pure Rust** | `fips205` Rust crate | Rust | Fully Rust-native implementation. |
| **3. Hybrid** | `sphincsplus` C library (NIST reference) | Rust | Combines the proven C core with a Rust wrapper. |

### Compare Metrics

While performance was not the primary deciding factor, the contracts showed differences in size and computational cost:

| Metric | Pure C | Pure Rust | Hybrid |
| :--- | :--- | :--- | :--- |
| **Minimised Contract Size** | $\text{206K}$ | $\text{224K}$ | $\text{277K}$ |
| **Cycle Consumption** | Fastest ($\approx 60\%$ of Rust cycles) | Slowest | Similar to Pure C |

More details on performance can be found in [Performance Doc](../docs/performance.md).

### Rationale for Version Selection

The decision to choose a specific version is driven by two critical factors: **Cryptographic Assurance** and **Long-Term Stability**.

#### 1. Maximum Cryptographic Assurance

For a quantum-resistant solution like SPHINCS+, the security of the underlying cryptographic primitive is paramount.

* The **`sphincsplus` C library** used in the Pure C and Hybrid versions is the **reference implementation** submitted to the NIST Post-Quantum Cryptography Standardization process. It is authored and maintained by the original creators of the SPHINCS+ algorithm.
* This high level of scrutiny and maintenance by leading cryptographers provides the greatest assurance that the implementation is robust and free from subtle cryptographic errors.

#### 2. Long-Term Stability for HODL Use Case

SPHINCS+ is intended primarily as a **long-term security solution** for users who wish to secure their assets against potential future quantum attacks (e.g., over a $\text{10-20}$ year period). This use case demands a contract that is maximally stable and immutable.

* We prioritize **foundational stability** over added features or a rapidly changing ecosystem.
* The **Pure C** implementation, leveraging mature, stable toolchains and the proven `sphincsplus` C library, offers the most reliable foundation for a contract intended to remain unchanged for decades.

### Conclusion

We would want to deploy the **Pure C Implementation Contract** due to its combination of superior cryptographic assurance (NIST reference implementation) and its stability for long-term, quantum-resistant asset protection. This approach ensures the most trustworthy and enduring lock on the CKB chain.

While the Pure Rust and Hybrid versions offer interesting trade-offs, user may also consider them for experimental or short-term use cases where rapid iteration or Rust-native tooling is prioritized over the highest assurance and long-term stability.