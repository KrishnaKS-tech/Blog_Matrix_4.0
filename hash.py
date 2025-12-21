import hashlib

# Get input from user
text = input("Enter text to hash: ")

# Encode the string and create SHA-256 hash
hash_object = hashlib.sha256(text.encode())

# Convert the hash object to hexadecimal representation
hash_hex = hash_object.hexdigest()

# Display the hash (length is 64 characters = 256 bits)
print("SHA-256 Hash:", hash_hex)
print("Hash length:", len(hash_hex))
