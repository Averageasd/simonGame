import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { colorConstants, NUM_CELLS } from './gameConstant';
import { Cell } from './Cell';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'simonGame';
  botMovement: WritableSignal<Cell[]> = signal([]);
  playerPattern: WritableSignal<Cell[]> = signal([]);
  playerTurn: WritableSignal<boolean> = signal(false);
  botTurn: WritableSignal<boolean> = signal(true);
  displayMove: WritableSignal<boolean> = signal(false);
  allCellsDisabled: WritableSignal<boolean> = signal(true);
  gameFinished: WritableSignal<boolean> = signal(false);
  gameStart: WritableSignal<boolean> = signal(false);
  cells: WritableSignal<Cell[]> = signal([]);
  async ngOnInit(): Promise<any> {
    this.initGameState();
  }

  private initGameState(): void {
    const curCellsState = this.cells();
    curCellsState.push({
      id: uuidv4(),
      backgroundColor: colorConstants.RED,
      selected: false,
    });
    curCellsState.push({
      id: uuidv4(),
      backgroundColor: colorConstants.YELLOW,
      selected: false,
    });
    curCellsState.push({
      id: uuidv4(),
      backgroundColor: colorConstants.PURPLE,
      selected: false,
    });
    curCellsState.push({
      id: uuidv4(),
      backgroundColor: colorConstants.BLUE,
      selected: false,
    });
    this.cells.set(curCellsState);
  }

  async onGameStart(): Promise<void> {
    this.newGameResetState();
    await this.botMove();
  }

  newGameResetState(): void {
    this.playerPattern.set([]);
    this.botMovement.set([]);
    this.gameStart.set(true);
    this.gameFinished.set(false);
    this.displayMove.set(false);
  }

  generateRandomMove(): Cell[] {
    let curBotMovement: Cell[] = this.botMovement();
    let curCells: Cell[] = this.cells();
    curBotMovement = [];
    for (let i = 0; i < NUM_CELLS; i++) {
      const randMove: number = Math.floor(Math.random() * NUM_CELLS);
      curBotMovement.push(curCells[randMove]);
    }
    return curBotMovement;
  }

  sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async botMove() {
    await this.botMakeMovesWithRandCells();
    await this.sleep(1000);
    this.playerTakeTurn();
  }

  private async botMakeMovesWithRandCells(): Promise<void> {
    let curCells = this.cells();
    let curRandMoves = this.generateRandomMove();
    this.botMovement.set([...curRandMoves]);
    for (let i = 0; i < curCells.length; i++) {
      const curMove: Cell = curRandMoves[i];
      curMove.selected = true;
      this.cells.set([...curCells]);
      await this.sleep(2000);
      curMove.selected = false;
      this.cells.set([...curCells]);
      await this.sleep(1000);
    }
  }

  private playerTakeTurn(): void {
    this.playerTurn.set(true);
    this.allCellsDisabled.set(false);
    this.botTurn.set(false);
  }

  async userClick(cellPos: number) {
    const curCells = this.cells();
    const curPlayerPatterns = this.playerPattern();
    let curAllCellDisabledState = this.allCellsDisabled();
    curCells[cellPos].selected = true;
    curPlayerPatterns.push(curCells[cellPos]);
    curAllCellDisabledState = true;
    this.cells.set([...curCells]);
    this.playerPattern.set([...curPlayerPatterns]);
    this.allCellsDisabled.set(curAllCellDisabledState);
    await this.sleep(1000);
    curAllCellDisabledState = false;
    this.allCellsDisabled.set(curAllCellDisabledState);
    curCells[cellPos].selected = false;
    this.cells.set([...curCells]);
    await this.gameOverToDisplayStat();
  }

  private async gameOverToDisplayStat(): Promise<void> {
    const curPlayerPatterns = this.playerPattern();
    if (curPlayerPatterns.length === NUM_CELLS) {
      this.disablePlayerClicks();
      this.playerPattern.set([...curPlayerPatterns]);
      await this.sleep(2000);
      this.concludeGame();
    }
  }

  private disablePlayerClicks(): void {
    this.allCellsDisabled.set(true);
    this.playerTurn.set(false);
    this.gameFinished.set(true);
  }

  private concludeGame(): void {
    this.displayMove.set(true);
    this.gameStart.set(false);
  }
}
