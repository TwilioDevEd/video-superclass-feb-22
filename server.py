import os

import twilio.jwt.access_token
import twilio.jwt.access_token.grants
import twilio.rest
from dotenv import load_dotenv
from flask import Flask, render_template, request

# Create a Flask app
app = Flask(__name__)

# Load environment variables from a `.env` file
load_dotenv()

# Twilio credentials
account_sid = os.environ["TWILIO_ACCOUNT_SID"]
api_key = os.environ["TWILIO_API_KEY"]
api_secret = os.environ["TWILIO_API_SECRET"]

# Room settings
ROOM_NAME = "Superclass!"
MAX_PARTICIPANTS = 6


@app.route("/")
def serve():
    """Render the homepage."""
    return render_template("index.html")


@app.route("/token", methods=["POST"])
def get_token():
    """Create and return an Access Token for a specific participant to join the video room"""
    # retrieve the participant's identity from the request's JSON payload
    identity = request.json.get("identity")
    # create an access token with your account credentials and the participant's identity
    access_token = twilio.jwt.access_token.AccessToken(
        account_sid, api_key, api_secret, identity=identity
    )
    # create a video grant that will allow access to this app's specific video room
    video_grant = twilio.jwt.access_token.grants.VideoGrant(room=ROOM_NAME)
    # Add the video grant to the access token
    access_token.add_grant(video_grant)
    # Turn the access token into a string and send it back as the response
    return {"token": access_token.to_jwt()}


# Start the server when we run this file
if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
