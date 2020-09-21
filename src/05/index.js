import { createMachine, assign, interpret } from "xstate";

const elBox = document.querySelector("#box");
const elBody = document.body;

const assignPoint = assign({
  px: (context, event) => event.clientX,
  py: (context, event) => event.clientY,
});

const assignDelta = assign({
  dx: (context, event) => event.clientX - context.px,
  dy: (context, event) => event.clientY - context.py,
});

const assignPosition = assign({
  x: (context) => context.x + context.dx,
  y: (context) => context.y + context.dy,
  px: 0,
  py: 0,
  dx: 0,
  dy: 0,
});

const machine = createMachine(
  {
    initial: "idle",
    context: {
      x: 0,
      y: 0,
      dx: 0,
      dy: 0,
      px: 0,
      py: 0,
    },
    states: {
      idle: {
        on: {
          mousedown: {
            actions: "assignPoint",
            target: "dragging",
          },
        },
      },
      dragging: {
        on: {
          mousemove: {
            actions: "assignDelta",
          },
          mouseup: {
            actions: "assignPosition",
            target: "idle",
          },
        },
      },
    },
  },
  {
    actions: { assignPoint, assignDelta, assignPosition },
  }
);

const service = interpret(machine);

service.onTransition((state) => {
  if (state.changed) {
    console.log(state.context);

    elBox.dataset.state = state.value;

    elBox.style.setProperty("--dx", state.context.dx);
    elBox.style.setProperty("--dy", state.context.dy);
    elBox.style.setProperty("--x", state.context.x);
    elBox.style.setProperty("--y", state.context.y);
  }
});

service.start();

elBox.addEventListener("mousedown", service.send);
elBox.addEventListener("mousemove", service.send);
elBox.addEventListener("mouseup", service.send);
