import * as signalR from '@microsoft/signalr';
import {
  BattleStartedPayload,
  DisconnectGracePayload,
  MatchFoundPayload,
  MatchResultPayload,
  OpponentProgressPayload,
  PlayerProgressDto,
  QueueStatusPayload,
} from '../types/game';

export type QueueStatusCallback = (payload: QueueStatusPayload) => void;
export type MatchFoundCallback = (payload: MatchFoundPayload) => void;
export type BattleStartedCallback = (payload: BattleStartedPayload) => void;
export type OpponentProgressCallback = (payload: OpponentProgressPayload) => void;
export type OpponentDisconnectedCallback = (payload: DisconnectGracePayload) => void;
export type OpponentReconnectedCallback = () => void;
export type MatchFinishedCallback = (payload: MatchResultPayload) => void;
export type ErrorCallback = (error: string) => void;

class BattleSignalRService {
  private connection: signalR.HubConnection | null = null;
  private queueStatusListeners = new Set<QueueStatusCallback>();
  private matchFoundListeners = new Set<MatchFoundCallback>();
  private battleStartedListeners = new Set<BattleStartedCallback>();
  private opponentProgressListeners = new Set<OpponentProgressCallback>();
  private opponentDisconnectedListeners = new Set<OpponentDisconnectedCallback>();
  private opponentReconnectedListeners = new Set<OpponentReconnectedCallback>();
  private matchFinishedListeners = new Set<MatchFinishedCallback>();
  private errorListeners = new Set<ErrorCallback>();

  public isConnected(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected;
  }

  public async connect(token: string): Promise<void> {
    if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
      return;
    }

    if (this.connection) {
      await this.disconnect();
    }

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`/hubs/battle?access_token=${encodeURIComponent(token)}`, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 15000])
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    // Register event handlers
    this.connection.on('QueueStatusUpdate', (payload: QueueStatusPayload) => {
      this.queueStatusListeners.forEach((cb) => cb(payload));
    });

    this.connection.on('MatchFound', (payload: MatchFoundPayload) => {
      this.matchFoundListeners.forEach((cb) => cb(payload));
    });

    this.connection.on('BattleStarted', (payload: BattleStartedPayload) => {
      this.battleStartedListeners.forEach((cb) => cb(payload));
    });

    this.connection.on('OpponentProgressUpdate', (payload: OpponentProgressPayload) => {
      this.opponentProgressListeners.forEach((cb) => cb(payload));
    });

    this.connection.on('OpponentDisconnected', (payload: DisconnectGracePayload) => {
      this.opponentDisconnectedListeners.forEach((cb) => cb(payload));
    });

    this.connection.on('OpponentReconnected', () => {
      this.opponentReconnectedListeners.forEach((cb) => cb());
    });

    this.connection.on('MatchFinished', (payload: MatchResultPayload) => {
      this.matchFinishedListeners.forEach((cb) => cb(payload));
    });

    this.connection.on('Error', (err: string) => {
      this.errorListeners.forEach((cb) => cb(err));
    });

    try {
      await this.connection.start();
    } catch (err) {
      console.error('Failed to start SignalR connection to BattleHub:', err);
      throw err;
    }
  }

  public async disconnect(): Promise<void> {
    if (this.connection) {
      try {
        await this.connection.stop();
      } catch (err) {
        console.warn('Error while stopping SignalR connection:', err);
      } finally {
        this.connection = null;
      }
    }
  }

  public async joinMatchmakingQueue(preferredTopicId?: string): Promise<void> {
    if (!this.isConnected()) {
      throw new Error('SignalR is not connected');
    }
    await this.connection!.invoke('JoinMatchmakingQueue', { preferredTopicId });
  }

  public async leaveMatchmakingQueue(): Promise<void> {
    if (!this.isConnected()) return;
    await this.connection!.invoke('LeaveMatchmakingQueue');
  }

  public async sendPlayerProgress(progress: PlayerProgressDto): Promise<void> {
    if (!this.isConnected()) return;
    await this.connection!.invoke('SendPlayerProgress', progress);
  }

  public async finishMatchEarly(matchId: string, totalTimeMs: number): Promise<void> {
    if (!this.isConnected()) return;
    await this.connection!.invoke('FinishMatchEarly', { matchId, totalTimeMs });
  }

  public async forfeitMatch(matchId: string): Promise<void> {
    if (!this.isConnected()) return;
    await this.connection!.invoke('ForfeitMatch', { matchId });
  }

  public async reconnectMatch(matchId: string): Promise<void> {
    if (!this.isConnected()) return;
    await this.connection!.invoke('ReconnectMatch', { matchId });
  }

  // Subscriptions
  public onQueueStatusUpdate(cb: QueueStatusCallback): () => void {
    this.queueStatusListeners.add(cb);
    return () => this.queueStatusListeners.delete(cb);
  }

  public onMatchFound(cb: MatchFoundCallback): () => void {
    this.matchFoundListeners.add(cb);
    return () => this.matchFoundListeners.delete(cb);
  }

  public onBattleStarted(cb: BattleStartedCallback): () => void {
    this.battleStartedListeners.add(cb);
    return () => this.battleStartedListeners.delete(cb);
  }

  public onOpponentProgressUpdate(cb: OpponentProgressCallback): () => void {
    this.opponentProgressListeners.add(cb);
    return () => this.opponentProgressListeners.delete(cb);
  }

  public onOpponentDisconnected(cb: OpponentDisconnectedCallback): () => void {
    this.opponentDisconnectedListeners.add(cb);
    return () => this.opponentDisconnectedListeners.delete(cb);
  }

  public onOpponentReconnected(cb: OpponentReconnectedCallback): () => void {
    this.opponentReconnectedListeners.add(cb);
    return () => this.opponentReconnectedListeners.delete(cb);
  }

  public onMatchFinished(cb: MatchFinishedCallback): () => void {
    this.matchFinishedListeners.add(cb);
    return () => this.matchFinishedListeners.delete(cb);
  }

  public onError(cb: ErrorCallback): () => void {
    this.errorListeners.add(cb);
    return () => this.errorListeners.delete(cb);
  }
}

export const battleSignalR = new BattleSignalRService();
