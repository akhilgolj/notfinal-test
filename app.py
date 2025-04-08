from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import openai
import os

app = Flask(__name__)
CORS(app)

openai.api_key = "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"  # Use an environment variable for security

@app.route("/")
def index():
    return render_template("chatbot.html")  # Serves chatbot.html

@app.route("/chat", methods=["POST"])
def chat():
    try:
        if not request.is_json:
            return jsonify({"error": "Request must be JSON"}), 400

        user_message = request.json.get("message")
        if not user_message:
            return jsonify({"error": "No message provided"}), 400

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": user_message}]
        )

        chatbot_reply = response["choices"][0]["message"]["content"]
        return jsonify({"response": chatbot_reply})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
