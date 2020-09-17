const elBox = document.querySelector("#box");

const machine = {
  initialState: "inactive",
  states: {
    inactive: {
      on: {
        TOGGLE: "active",
      },
    },
    active: {
      on: {
        TOGGLE: "inactive",
      },
    },
  },
};

// Pure function that returns the next state,
// given the current state and sent event
function transition(state, event) {
  return machine.states[state]?.on?.[event] || state;
}

// Keep track of your current state
let currentState = machine.initialState;

function send(event) {
  currentState = transition(currentState, event);
  elBox.dataset.state = currentState;
}

elBox.addEventListener("click", () => {
  send("TOGGLE");
});
