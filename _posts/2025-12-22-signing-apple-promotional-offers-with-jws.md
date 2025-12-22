---
title: Signing Apple promotional offers with JWS
tags:
  - rails
  - payment
  - apple
  - cryptography
---

We wanted to give existing subscribers a promotional price. Someone who subscribed before, who has lapsed or is about to lapse, and we want to win them back with a discount. On Apple, you cannot just change a price. The server has to send Apple a signed token that says "this user is allowed this offer", and Apple checks the signature before it honors the offer.

The signature format is JWS. There is a fun connection here for me. A couple of years ago I was on the other side of this, verifying signed callbacks from an ad network. Now I am the one who signs.

## What JWS is, in short

JWS means JSON Web Signature. The idea is the same as any signature scheme. You have some data. You sign it with a private key. Then anyone with the matching public key can confirm the data is real and not changed.

What JWS adds is a standard layout. A JWS has three parts, joined by dots:

```
header.payload.signature
```

The header says how it was signed and which key was used. The payload is the data you are vouching for. The signature is computed over the header and the payload together, with your private key. Apple holds the public side (you register your key with them), so they can verify what you send.

For these offers I was on the signing side. So I needed three things right: the key, the key id, and a nonce.

The key is the private signing key. Apple gave us a key id for it. The key id goes in the header, so Apple knows which of your keys to verify against. This also means you can rotate keys without breaking everything. The nonce is a one-time value tied to the request, so the same signed token cannot be replayed later for a different transaction.

The signing itself is short. Most of the work is building the exact payload Apple expects, and not messing up the key handling.

```ruby
header = {
  alg: "ES256",
  kid: APPLE_KEY_ID,
}

payload = {
  productId:    offer.product_id,
  offerId:      offer.id,
  nonce:        SecureRandom.uuid,
  timestamp:    (Time.now.to_f * 1000).to_i,
  # plus the other fields Apple requires
}

jws = JWT.encode(payload, signing_key, "ES256", header)
```

`ES256` means the signature uses elliptic-curve crypto with SHA-256, which is what Apple wants here. The thing that bit me, the same as last time on the verifying side, was getting the payload fields and their order exactly as specified. A signature that is cryptographically fine still gets rejected if you do not build the payload the way the other side expects.

## Eligibility is its own problem

Signing the token is only half of it. The other half is deciding who gets the offer at all. That part needed more care than the crypto.

The offer was for returning users: people who subscribed before. A brand-new user who never subscribed should not get the win-back price. Then it is not winning anyone back, it is just a discount for everyone. So before I sign anything, I check eligibility on our side. Does this user have a subscription history that qualifies? Are they in the window we target? Did they already use this offer?

This matters because signing is a statement of trust. When my server signs the token, it tells Apple "yes, this person qualifies". If my eligibility check is loose, I am signing offers that should never go out, and the signature does not save me here. The crypto proves the message came from us. It says nothing about whether we should have sent it.

So the order is: check eligibility first, and sign only if it passes. The signature is the last step, not the gate.

## The two sides of a signature

It was nice to notice that the same primitive shows up on both ends of my work, years apart. Back then I held a public key and checked that incoming callbacks were real. This time I hold a private key and produce tokens that someone else checks. It is the same crypto, just from the other side.

The practical lessons are the same on both sides though. Get the signed bytes exactly right. Treat the key id as the thing that lets you rotate keys safely. And remember that the signature only proves where a message came from. Whether the message should exist at all is a separate decision that you still have to make.
