---
title: Verifying rewarded-ad callbacks server-side
tags:
  - go
  - security
  - ad
  - cryptography
---

Rewarded ads are the ones where a user watches a video and gets something back. Finish the ad, get some energy, or coins, or an extra life. When it works, it is nice for everyone: the user gets a reward, and we get ad revenue.

The part that is easy to get wrong is how you decide that the user really earned the reward.

## The simple but wrong way

When the ad finishes, the ad network tells you with a callback. Your server gets a request that says, more or less, "user X finished the ad, give them the reward". You look up user X and add the coins.

If you stop here, you built a coin printer. Anyone who can guess the shape of that callback can send it by themselves. They do not need to watch an ad. They just call your endpoint with the right user id and farm rewards all day. And these endpoints are not secret. People find them.

So you cannot trust the callback only because it arrived. You have to verify that it really came from the ad network, and that nobody forged it.

## Why client-side checks do not help

The first idea is to check things on the client. Confirm in the app that the ad really played, then call your own server.

This does not work, and the reason is simple. The client is fully under the attacker's control. Someone with a modified app, or someone who just replays requests with a proxy, can make the client say anything. Any check that runs on a device you do not control is only a suggestion, not a guarantee. The decision about whether a reward is real must happen on the server, using something the client cannot fake.

## Signed server-to-server callbacks

The way that does work is a signed callback, sent server to server.

The ad network sends the callback directly to your server, not through the app. Each callback includes a signature. The signature is a value computed over the callback content with a private key that only the ad network has. You hold the matching public key. You compute over the content again and check that the signature verifies with that public key.

If it verifies, the callback really came from the ad network, and nobody changed it on the way. If it does not, you drop it. An attacker cannot make a valid signature, because they do not have the private key. That is the whole point of public-key signatures.

One real detail here is key rotation. Networks change their signing keys from time to time, so the callback also carries a key id. You keep a small set of public keys. You look up the one named by the key id, and you verify against that one. When the network moves to a new key, the key id changes. If you already fetched the new public key, verification keeps working without a panic.

In Go the verify step is small. The hard part is keeping the right public keys, and getting the signed bytes exactly right.

```go
func verify(pub *ecdsa.PublicKey, signedBytes, sig []byte) bool {
    hash := sha256.Sum256(signedBytes)
    return ecdsa.VerifyASN1(pub, hash[:], sig)
}
```

The thing to be careful with is `signedBytes`. You must sign and verify over the exact same bytes, in the exact same order that the network specified. If you reorder query parameters, or re-encode something, the hash changes, and a valid callback fails to verify. I lost time on this. My signature check kept failing, not because the signature was bad, but because I built the signed string a little differently than the network did.

## What I would tell myself starting out

Treat every incoming callback as hostile until the signature says otherwise. The reward is money. Anything that gives money on an unverified request will get abused.

And keep the verification on the server, with a key the client never sees. The client can help with the experience, but it cannot be the thing that decides whether a reward is real.
