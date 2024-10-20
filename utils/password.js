import crypto from "crypto";

function encrypt(password, salt = crypto.randomBytes(256)) {
  return new Promise((resolve, reject) => {
    if (!salt) return reject(new Error("Salt is missing"));
    crypto.pbkdf2(password, salt, 100000, 64, "sha512", (err, hash) => {
      if (err) return reject(err);
      resolve({ hash, salt });
    });
  });
}

async function validatePassword(password, salt, hash) {
  const { hash: generatedHash } = await encrypt(password, salt);
  return crypto.timingSafeEqual(hash, generatedHash);
}

export { encrypt, validatePassword };
