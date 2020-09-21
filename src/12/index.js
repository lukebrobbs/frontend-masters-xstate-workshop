import { createMachine, assign, interpret } from "xstate";

const elBox = document.querySelector("#box");
const elcancel = document.querySelector("#cancel");

const randomFetch = () => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      if (Math.random() < 0.5) {
        rej("Fetch failed!");
      } else {
        res("Fetch succeeded!");
      }
    }, 2000);
  });
};

const createFetchMachine = (timeout) =>
  createMachine(
    {
      initial: "idle",
      context: {
        timeout,
      },
      states: {
        idle: {
          on: {
            FETCH: "pending",
          },
        },
        pending: {
          on: {
            CANCEL: "idle",
          },
          invoke: {
            src: (context, event) => {
              return randomFetch();
            },
            onDone: "resolved",
            onError: "rejected",
          },
          after: {
            TIMEOUT: {
              target: "idle",
            },
          },
        },
        resolved: {
          on: {
            FETCH: "pending",
          },
        },
        rejected: {
          on: {
            FETCH: "pending",
          },
        },
      },
    },
    {
      delays: {
        TIMEOUT: (context) => context.timeout,
      },
    }
  );

const service = interpret(createFetchMachine(2000));

service.onTransition((state) => {
  elBox.dataset.state = state.toStrings().join(" ");

  console.log(state);
});

service.start();

elBox.addEventListener("click", (event) => {
  service.send("FETCH");
});

elcancel.addEventListener("click", () => {
  service.send("CANCEL");
});
