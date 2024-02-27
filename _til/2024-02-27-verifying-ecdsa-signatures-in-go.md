---
title: "Verifying an ECDSA signature in Go"
tags:
  - go
  - cryptography
---

We had a server-to-server callback that came signed, and I needed to verify it in Go. The flow is short: parse the public key (usually it comes as PEM, sometimes raw DER), hash the message body, then give both to `ecdsa.VerifyASN1`.

```go
block, _ := pem.Decode(pemBytes)
pub, err := x509.ParsePKIXPublicKey(block.Bytes)
if err != nil {
    return err
}
ecPub := pub.(*ecdsa.PublicKey)

hash := sha256.Sum256(body)
if !ecdsa.VerifyASN1(ecPub, hash[:], sig) {
    return errors.New("bad signature")
}
```

`VerifyASN1` expects the signature already in ASN.1 form. This is what most senders give you, so I did not have to unpack r and s by hand. One thing that is good to keep: a `key_id` next to the signature. Then the sender can rotate keys and you still know which public key to verify against.
