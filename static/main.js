window.addEventListener("load", () => {
  // initialize number of participants with local video.
  // we can have a max of six participants.
  let availableYarn = [1, 2, 3, 4, 5, 6];

  // element identifiers
  const startDiv = document.getElementById("start");
  const identityInput = document.getElementById("identity");
  const joinButton = document.getElementById("join");

  // join the video room
  async function connect() {
    startDiv.style.display = "none";
    // TODO: Fetch an access token
    const response = await fetch("/token", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({identity: identityInput.value})
    });
    const { token } = await response.json();
    console.log(token);

    // TODO: Use the access token to join a room
    const room = await Twilio.Video.connect(token, {
      name: "Superclass!",
      video: {height: 200},
      audio: false
    })
    console.log(room);
    Twilio.VideoRoomMonitor.registerVideoRoom(room);
    Twilio.VideoRoomMonitor.openMonitor();

    handleConnectedParticipant(room.localParticipant);
    room.participants.forEach(handleConnectedParticipant);
    room.on("participantConnected", handleConnectedParticipant);

    room.on("participantDisconnected", handleDisconnectedParticipant);
    window.addEventListener("pagehide", () => { room.disconnect() });
    window.addEventListener("beforeunload", () => {room.disconnect()});
  }

  // TODO: Complete function for handling when a participant connects to the room
  function handleConnectedParticipant(participant) {
    findNextAvailableYarn(participant);
    participant.tracks.forEach((trackPublication) => {
      handleTrackPublished(trackPublication, participant);
    });
    participant.on("trackPublished", (trackPublication) => {
      handleTrackPublished(trackPublication, participant);
    });
  }

  // TODO: Complete function for handling when a new participant track is published
  function handleTrackPublished(trackPublication, participant) {
    const yarn = document.getElementById(`yarn-${participant.number}`);
    function handleTrackSubscribed(track) {
      yarn.appendChild(track.attach());
    }
    if (trackPublication.track) {
      handleTrackSubscribed(trackPublication.track);
    }
    trackPublication.on("subscribed", handleTrackSubscribed);
  }

  // tidy up helper function for when a participant disconnects
  // or closes the page
  function handleDisconnectedParticipant(participant) {
    participant.removeAllListeners();
    const el = document.getElementById(`yarn-${participant.number}`);
    el.innerHTML = "";
    availableYarn.push(participant.number);
  }

  // helper to find a spot on the page to display participant video
  function findNextAvailableYarn(participant) {
    const index = Math.floor(Math.random() * availableYarn.length);
    const choice = availableYarn[index];
    availableYarn = availableYarn.filter((e) => e != choice);
    participant.number = choice;
  }

  // event listeners
  joinButton.addEventListener("click", connect);
});
