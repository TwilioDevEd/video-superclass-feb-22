# Twilio Video Demo

This is the code written during the live Twilio Video
demo during Twilio's Signal 2021 Superclass.

It creates a simple Video application that displays a virtual
knitting circle and populates each yarn ball with an HTML
video element when a participant enters the Room.

The main branch contains the base code where we began our live demo.
Check out the `superclass-demo` branch to see the completed code that we wrote during the session.

## Running the application

You'll need Python3 to get this running. To install the required
dependencies:

```
python3 -m venv venv  # create a virtual environment
source venv/bin/activate
pip install -r requirements.txt
```

Next, create a `.env` file. You'll put your account
credentials in that file, so that the Flask server can
connect to Twilio.

```
touch .env
```

In the .env file, you'll want these credentials:

```
TWILIO_ACCOUNT_SID=<your account SID>
TWILIO_API_KEY=<your api key>
TWILIO_API_SECRET=<your api key secret>
```

You can find your account SID in the [Twilio Console Dashboard](https://www.twilio.com/console).

You can create a new API key and get the secret through the
[Twilio Console](https://www.twilio.com/console/project/api-keys).

To run the Flask server:

```
source venv/bin/activate
python server.py
```

This will start a server that you can access on your
local machine at port 5000 (`localhost:5000`). You can view the application
at [http://localhost:5000](http://localhost:5000).

Can't wait to see what you build with Twilio Video!

## Other branches

- `superclass-demo`: The code we wrote in this class (to be committed after the demo is over)
- `blurred-backgrounds`: Uses Twilio's [Video Processors](https://www.twilio.com/docs/video/video-processors) to blur a participant's background
- `livestream`: Uses [Twilio Live](https://www.twilio.com/docs/live) to livestream the video room
- `full-commented-code`: A full version of the application we're building during the Superclass, with comments on each aspect

## Other Resources

- [Full-featured Twilio Video React app](https://github.com/twilio/twilio-video-app-react)

### Troubleshooting and Diagnostics

- [Video Insights](https://www.twilio.com/docs/video/troubleshooting/insights)
- [Preflight check API](https://github.com/twilio/twilio-video.js/blob/master/CHANGELOG.md#2160-august-11-2021)
- [Video Diagnostics App](https://www.twilio.com/blog/video-diagnostics-app-reactjs-preflight-api)
- [Video Monitor](https://www.npmjs.com/package/@twilio/video-room-monitor)
- [Network Quality API](https://www.twilio.com/docs/video/using-network-quality-api)

### Virtual Backgrounds and Custom Video Filters

- [Demo](https://twilio.github.io/twilio-video-processors.js/examples/virtualbackground/)
- [General information](https://www.twilio.com/blog/introducing-virtual-backgrounds-browser-based-video-applications)
- [Custom filters](https://www.twilio.com/blog/custom-effect-filters-twilio-programmable-video)
- [Virtual background](https://www.twilio.com/blog/change-background-video-calls-twilio-video-processors-library)

### Twilio Live

- [Twilio Live overview](https://www.twilio.com/docs/live/overview)
- [Live video demo application](https://www.twilio.com/docs/live/build-an-interactive-live-video-streaming-experience)
- [Build a video livestreaming application with Twilio Live and Express](https://www.twilio.com/blog/build-livestreaming-application-twilio-live-express)
- [Live stream your screen](https://www.twilio.com/blog/live-stream-screen-twilio-live)
- [Billing and resource management best practices](https://www.twilio.com/docs/live/billing-and-resource-management)

### Other

- [Ad-hoc room creation](https://www.twilio.com/docs/video/tutorials/understanding-video-rooms#ad-hoc-rooms): Create a Room from the browser, without a server
- [Dominant Speaker Detection](https://www.twilio.com/docs/video/detecting-dominant-speaker): Detect the currently active speaker in a Room
- [Track Subscription API](https://www.twilio.com/docs/video/api/track-subscriptions): Fine-tune which tracks participants will subscribe to in a Room
- [Recordings and compositions](https://www.twilio.com/docs/video/tutorials/understanding-video-recordings-and-compositions): Record group rooms and lay them out in a specific format with compositions.
- [Simulcast](https://www.twilio.com/docs/video/tutorials/working-with-vp8-simulcast): Use simulcast to enhance the quality of group rooms for participants with different connectivity options
- [Network Bandwidth Profile API](https://www.twilio.com/docs/video/tutorials/using-bandwidth-profile-api): Specify how tracks will be prioritized based on participant bandwidth
