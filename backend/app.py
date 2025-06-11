# app.py
import os
from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
from dotenv import load_dotenv
from flask_bcrypt import Bcrypt
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity
)
from bson import ObjectId  # <-- Add this import

# ----------------------------
# 1) Load environment variables
# ----------------------------
load_dotenv()  # reads .env in development

# ----------------------------
# 2) Initialize Flask app
# ----------------------------
app = Flask(__name__)

# MongoDB URI (set in .env or host’s config)
app.config["MONGO_URI"] = os.getenv("MONGODB_URI")

# JWT configuration
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")  
# (In production, JWT_SECRET_KEY must come from env, not default)

# ----------------------------
# 3) Initialize extensions
# ----------------------------
mongo = PyMongo(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# Enable CORS (adjust the origin to your GitHub Pages domain)
# e.g. "https://micah-tam.github.io"
CORS(app, origins="*")

# ----------------------------
# 4) Define collections
# ----------------------------
users_coll = mongo.db.users

# ----------------------------
# 7) Registration route
# ----------------------------
@app.route("/register", methods=["POST"])
def register():
    """
    Expects JSON:
    {
      "username": "alice",
      "password": "supersecret"
    }
    """
    try:
        data = request.get_json(force=True)
        username = data.get("username", "").strip().lower()
        password = data.get("password", "")

        if not username or not password:
            return jsonify({"error": "Username and password are required"}), 400

        # Check if user already exists
        if users_coll.find_one({ "username": username }):
            return jsonify({ "error": "User already exists" }), 400

        # Hash the password
        pw_hash = bcrypt.generate_password_hash(password).decode("utf-8")

        # Insert into MongoDB
        users_coll.insert_one({
            "username": username,
            "password": pw_hash,
            # You could store additional fields here (e.g. email, created_at, roles, etc.)
        })

        return jsonify({ "msg": "User registered successfully" }), 201

    except Exception as e:
        return jsonify({ "error": "Registration failed", "details": str(e) }), 500

# ----------------------------
# 8) Login route
# ----------------------------
@app.route("/login", methods=["POST"])
def login():
    """
    Expects JSON:
    {
      "username": "alice",
      "password": "supersecret"
    }
    Returns:
    {
      "access_token": "<JWT_TOKEN>"
    }
    """
    try:
        data = request.get_json(force=True)
        username = data.get("username", "").strip().lower()
        password = data.get("password", "")

        if not username or not password:
            return jsonify({"error": "Username and password are required"}), 400

        # Lookup user in MongoDB
        user = users_coll.find_one({ "username": username })
        if not user:
            return jsonify({ "error": "Invalid credentials" }), 401

        # Verify password
        if not bcrypt.check_password_hash(user["password"], password):
            return jsonify({ "error": "Invalid credentials" }), 401

        # Create a JWT that encodes the user’s _id (or any identity payload)
        access_token = create_access_token(identity=str(user["_id"]))

        return jsonify({ "access_token": access_token }), 200

    except Exception as e:
        return jsonify({ "error": "Login failed", "details": str(e) }), 500

# ----------------------------
# 9) Example of a protected route
# ----------------------------
@app.route("/dashboard", methods=["GET"])
@jwt_required()  # client must send "Authorization: Bearer <JWT_TOKEN>"
def dashboard():
    current_user_id = get_jwt_identity()
    try:
        user = users_coll.find_one({ "_id": ObjectId(current_user_id) }, { "password": 0 })
    except Exception:
        return jsonify({ "error": "Invalid user ID" }), 400

    if not user:
        return jsonify({ "error": "User not found" }), 404

    return jsonify({
        "id": str(user["_id"]),
        "username": user["username"],
        # …any other public fields…
    }), 200

# ----------------------------
# 10) Start the server
# ----------------------------
if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port)