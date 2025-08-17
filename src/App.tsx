import { useEffect, useState, type JSX } from "react";
import "./App.css";

type SpotState = "atom" | "neutron" | "empty";
type Direction = "left" | "right" | "up" | "down";

class Atom {
  x: number;
  y: number;
  leftNeighbor: Atom | null = null;
  rightNeighbor: Atom | null = null;
  hasMoved: boolean = false;
  topNeighbor: Atom | null = null;
  bottomNeighbor: Atom | null = null;
  state: SpotState;
  itemSize: number;
  direction: Direction | null = null;

  constructor(x: number, y: number, itemSize: number) {
    this.x = x;
    this.y = y;
    this.state = Math.random() > 0.9 ? "atom" : "empty";
    this.itemSize = itemSize;
  }

  // Set neighbors after creation if needed
  setNeighbors(
    left: Atom | null,
    right: Atom | null,
    top: Atom | null,
    bottom: Atom | null,
  ): void {
    this.leftNeighbor = left;
    this.rightNeighbor = right;
    this.topNeighbor = top;
    this.bottomNeighbor = bottom;
  }

  // Handle click logic
  handleClick(): void {
    console.log("clicked");
    this.emitRandomNeutron();
    this.emitRandomNeutron();
  }

  emitRandomNeutron(): void {
    const randomNum = Math.floor(Math.random() * 4);
    switch (randomNum) {
      case 0:
        this.leftNeighbor?.setState("neutron", "left");
        break;
      case 1:
        this.rightNeighbor?.setState("neutron", "right");
        break;
      case 2:
        this.topNeighbor?.setState("neutron", "up");
        break;
      case 3:
        this.bottomNeighbor?.setState("neutron", "down");
        break;
    }
  }

  handleIteration(): void {
    if (this.state !== "neutron") {
      return;
    }

    if (this.hasMoved) {
      return;
    }

    switch (this.direction) {
      case "left":
        this.leftNeighbor?.setState("neutron", "left");
        if (this.leftNeighbor) {
          this.leftNeighbor.hasMoved = true;
        }
        this.setState("empty", null);
        break;
      case "right":
        this.rightNeighbor?.setState("neutron", "right");
        if (this.rightNeighbor) {
          this.rightNeighbor.hasMoved = true;
        }
        this.setState("empty", null);
        break;
      case "up":
        this.topNeighbor?.setState("neutron", "up");
        if (this.topNeighbor) {
          this.topNeighbor.hasMoved = true;
        }
        this.setState("empty", null);
        break;
      case "down":
        this.bottomNeighbor?.setState("neutron", "down");
        this.setState("empty", null);
        if (this.bottomNeighbor) {
          this.bottomNeighbor.hasMoved = true;
        }
        break;
    }
  }

  // Change state manually
  setState(newState: SpotState, newDirection: Direction | null): void {
    if (this.state === "atom") {
      this.handleClick();
    }
    this.state = newState;
    this.direction = newDirection;
  }

  // Get current state
  getState(): SpotState {
    return this.state;
  }

  // Render method returns the JSX element
  render(): JSX.Element {
    const baseStyle: React.CSSProperties = {
      width: this.itemSize,
      height: this.itemSize,
      border: "1px solid black",
      gridColumn: this.x,
      gridRow: this.y,
    };

    switch (this.state) {
      case "atom":
        return (
          <div
            style={{ ...baseStyle, backgroundColor: "blue" }}
            onClick={() => this.handleClick()}
          />
        );
      case "neutron":
        return <div style={{ ...baseStyle, backgroundColor: "red" }} />;
      case "empty":
        return <div style={{ ...baseStyle, backgroundColor: "white" }} />;
      default:
        return <div style={{ ...baseStyle, backgroundColor: "white" }} />;
    }
  }
}
function App() {
  const size = 180;
  const itemSize = 5;

  const [_, forceRefresh] = useState(0);

  const [atoms, setAtoms] = useState<Atom[]>([]);

  useEffect(() => {
    const tempAtoms: Atom[] = [];
    for (let x = 1; x < size; x++) {
      for (let y = 1; y < size; y++) {
        const newAtom = new Atom(x, y, itemSize);
        tempAtoms.push(newAtom);
      }
    }

    tempAtoms.forEach((atom) => {
      const left = tempAtoms.find((a) => a.x === atom.x - 1 && a.y === atom.y);
      const right = tempAtoms.find((a) => a.x === atom.x + 1 && a.y === atom.y);
      const top = tempAtoms.find((a) => a.x === atom.x && a.y === atom.y - 1);
      const bottom = tempAtoms.find(
        (a) => a.x === atom.x && a.y === atom.y + 1,
      );
      atom.setNeighbors(
        left || null,
        right || null,
        top || null,
        bottom || null,
      );
    });

    setAtoms(tempAtoms);

    const inter = setInterval(() => {
      tempAtoms.forEach((atom) => atom.handleIteration());
      tempAtoms.forEach((atom) => (atom.hasMoved = false));
      forceRefresh(Math.random());
    }, 50);

    // Starts the reaction.
    const randomSpot = Math.floor(Math.random() * size * size);
    tempAtoms[randomSpot].handleClick();

    return () => {
      clearInterval(inter);
    };
  }, []);
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${size}, ${itemSize}px)`,
        gridTemplateRows: `repeat(${size}, ${itemSize}px)`,
      }}
    >
      {atoms.map((atom) => atom.render())}
    </div>
  );
}

export default App;
