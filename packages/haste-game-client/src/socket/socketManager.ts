import { HasteGameState, PlayerMovement } from '@haste-sdk/haste-game-domain';
import { io, Socket } from 'socket.io-client';
import { SocketMessage, WrappedClientSocket } from './socketManagerTypes';
import { Leader } from '@haste-sdk/domain';

// In order to clean up socket.io code from being
// spread throughout the client application, this
// manager class was created to wrap all socket events
export class SocketManager {
  private socket: Socket;
  gameInitEvent: WrappedClientSocket<void>;
  gameInitCompletedEvent: WrappedClientSocket<HasteGameState>;
  gameUpdateEvent: WrappedClientSocket<HasteGameState>;
  gameOverEvent: WrappedClientSocket<Leader[]>;
  gameStartEvent: WrappedClientSocket<void>;
  playerUpdateEvent: WrappedClientSocket<PlayerMovement>;
  logoutEvent: WrappedClientSocket<void>;

  constructor(serverUrl: string, token: string) {
    this.socket = io(serverUrl, {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      auth: { token },
    });
    this.initializeEvents();
  }

  initializeEvents() {
    this.gameInitEvent = this.createSocket('gameInit');
    this.gameInitCompletedEvent = this.createSocket('gameInitCompleted');
    this.gameUpdateEvent = this.createSocket('gameUpdate');
    this.gameStartEvent = this.createSocket('gameStart');
    this.gameOverEvent = this.createSocket<Leader[]>('gameOver');
    this.playerUpdateEvent = this.createSocket('playerUpdate');
    this.logoutEvent = this.createSocket('logout');
  }

  private createSocket<T>(event: SocketMessage): WrappedClientSocket<T> {
    return {
      emit: (data) => this.socket.emit(event, data),
      on: (callback) => this.socket.on(event, callback),
      off: (callback) => this.socket.off(event, callback),
    };
  }
}
