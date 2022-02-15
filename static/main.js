window.addEventListener("load", () => {
  // initialize number of participants with local video.
  // we can have a max of six participants.
  let availableYarn = [1, 2, 3, 4, 5, 6];

  // element identifiers
  const startDiv = document.getElementById("start");
  const identityInput = document.getElementById("identity");
  const joinButton = document.getElementById("join");
  const presentButton = document.getElementById("present");
  const presentationDiv = document.getElementById("presentation");
  const stopPresentationButton = document.getElementById("stop");

  // join the video room
  async function connect() {
    startDiv.style.display = "none";
    presentButton.style.display = "block";
    // TODO: Fetch an access token
    const response = await fetch("/token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ identity: identityInput.value }),
    });
    const { token } = await response.json();

    // TODO: Use the access token to join a room
    const room = await Twilio.Video.connect(token, {
      name: "Superclass!",
      video: true,
      audio: false,
      preferredVideoCodecs: "auto",
      bandwidthProfile: {
        video: {
          mode: "collaboration",
          contentPreferencesMode: "auto",
        },
      },
    });
    Twilio.VideoRoomMonitor.registerVideoRoom(room);
    Twilio.VideoRoomMonitor.openMonitor();

    handleConnectedParticipant(room.localParticipant);
    room.participants.forEach(handleConnectedParticipant);
    room.on("participantConnected", handleConnectedParticipant);

    room.on("participantDisconnected", handleDisconnectedParticipant);
    window.addEventListener("pagehide", () => {
      room.disconnect();
    });
    window.addEventListener("beforeunload", () => {
      room.disconnect();
    });

    // Presentation mode
    presentButton.addEventListener("click", () => {
      presentVideo(room.localParticipant);
    });
    stopPresentationButton.addEventListener("click", () => {
      stopPresentation(room.localParticipant);
    });
  }

  async function presentVideo(participant) {
    // remove video from yarn ball
    const yarn = document.getElementById(`yarn-${participant.number}`);
    stopPresentationButton.style.display = "inline";
    yarn.innerHTML = "";
    // unpublish existing video tracks
    const tracks = Array.from(participant.videoTracks.values());
    tracks.forEach((trackPublication) =>
      participant.unpublishTrack(trackPublication.track)
    );
    // create new video track with a high resolution and name it presentation
    const videoTrack = await Twilio.Video.createLocalVideoTrack({
      name: "presentation",
    });
    participant.publishTrack(videoTrack, { priority: "high" });
  }

  async function stopPresentation(participant) {
    // remove video from presentation
    presentationDiv.innerHTML = "";
    presentButton.style.display = "inline";
    stopPresentationButton.style.display = "none";
    setCircleUI();
    participant.presenting = false;
    const yarn = document.getElementById(`yarn-${participant.number}`);
    // unpublish existing video tracks
    const tracks = Array.from(participant.videoTracks.values());
    tracks.forEach((trackPublication) =>
      participant.unpublishTrack(trackPublication.track)
    );
    // create new video track with a high resolution and name it presentation
    const videoTrack = await Twilio.Video.createLocalVideoTrack();
    participant.publishTrack(videoTrack);
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
    participant.on("trackUnpublished", (trackPublication) => {
      handleTrackUnpublished(trackPublication, participant);
    });
  }

  // TODO: Complete function for handling when a new participant track is published
  function handleTrackPublished(trackPublication, participant) {
    const yarn = document.getElementById(`yarn-${participant.number}`);
    function handleTrackSubscribed(track) {
      if (track.name === "presentation") {
        presentationDiv.appendChild(track.attach());
        presentButton.style.display = "none";
        setPresentationUI();
        participant.presenting = true;
      } else {
        track.on("switchedOff", (track) => {
          handleTrackSwitchedOff(track, participant.number);
        });
        track.on("switchedOn", (track) => {
          handleTrackSwitchedOn(track, participant.number);
        });
        yarn.appendChild(track.attach());
      }
    }

    if (trackPublication.track) {
      handleTrackSubscribed(trackPublication.track);
    }
    trackPublication.on("subscribed", handleTrackSubscribed);
  }

  function handleTrackSwitchedOff(track, yarnNum) {
    const yarn = document.getElementById(`yarn-${yarnNum}`);
    console.log("switched off");
    yarn.innerHTML = "";
  }

  function handleTrackSwitchedOn(track, yarnNum) {
    console.log("switched on");
    const yarn = document.getElementById(`yarn-${yarnNum}`);
    yarn.appendChild(track.attach());
  }

  function handleTrackUnpublished(trackPublication, participant) {
    const yarn = document.getElementById(`yarn-${participant.number}`);
    if (trackPublication.trackName === "presentation") {
      presentationDiv.innerHTML = "";
      presentButton.style.display = "inline";
      setCircleUI();
      participant.presenting = false;
    } else {
      yarn.innerHTML = "";
    }
  }

  // tidy up helper function for when a participant disconnects
  // or closes the page
  function handleDisconnectedParticipant(participant) {
    participant.removeAllListeners();
    if (participant.presenting) {
      presentationDiv.innerHTML = "";
    }
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

  // presentation UI
  const yarn1 = document.getElementById("yarn-1");
  const yarn2 = document.getElementById("yarn-2");
  const yarn3 = document.getElementById("yarn-3");
  const yarn4 = document.getElementById("yarn-4");
  const yarn5 = document.getElementById("yarn-5");
  const yarn6 = document.getElementById("yarn-6");
  const needles = document.getElementById("needles");

  function setPresentationUI() {
    yarn1.style.marginTop = 0;
    yarn3.style.marginTop = "275px";
    yarn4.style.marginLeft = "20px";
    yarn5.style.marginRight = "275px";
    yarn5.style.marginTop = "275px";
    yarn6.style.bottom = 0;
    yarn6.style.marginRight = "275px";
    const video = presentationDiv.getElementsByTagName("video")[0];
    video.style.height = "720px";
    video.style.width = "1000px";
    video.style.marginRight = "200px";
    needles.style.display = "none";
  }
  // circle UI
  function setCircleUI() {
    yarn1.style.marginTop = "120px";
    yarn3.style.marginTop = "380px";
    yarn4.style.marginLeft = "275px";
    yarn5.style.marginRight = "20px";
    yarn5.style.marginTop = "120px";
    yarn6.style.marginTop = "380px";
    yarn6.style.marginRight = "20px";
    yarn6.style.removeProperty("bottom");
    needles.style.display = "inline";
  }
});
