/**
 * WebSocket Server Implementation
 * 
 * Handles real-time communication for:
 * - Multi-room chat synchronization
 * - Presence tracking
 * - Message broadcasting
 * - Participant status updates
 */

import { Server as HTTPServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import { getDb } from "./db";
import { websocketSessions, roomMessages } from "../drizzle/schema";
import { eq, and } from "drizzle-orm";

export interface RoomMessage {
  id: string;
  roomId: number;
  participantId: number;
  participantName: string;
  content: string;
  mode: string;
  temperature: string;
  timestamp: number;
}

export interface ParticipantPresence {
  participantId: number;
  participantName: string;
  status: "online" | "typing" | "offline";
  lastSeen: number;
}

export class WebSocketServer {
  private io: SocketIOServer;
  private roomParticipants: Map<number, Set<string>> = new Map();
  private userSessions: Map<string, { userId: number; roomId: number }> = new Map();

  constructor(httpServer: HTTPServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
      transports: ["websocket", "polling"],
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.io.on("connection", (socket: Socket) => {
      console.log(`[WebSocket] Client connected: ${socket.id}`);

      // Join room
      socket.on("join-room", async (data: { roomId: number; userId: number; participantName: string }) => {
        await this.handleJoinRoom(socket, data);
      });

      // Send message
      socket.on("send-message", async (data: RoomMessage) => {
        await this.handleSendMessage(socket, data);
      });

      // Typing indicator
      socket.on("typing", (data: { roomId: number; participantName: string }) => {
        this.handleTyping(socket, data);
      });

      // Stop typing
      socket.on("stop-typing", (data: { roomId: number; participantName: string }) => {
        this.handleStopTyping(socket, data);
      });

      // Leave room
      socket.on("leave-room", async (data: { roomId: number }) => {
        await this.handleLeaveRoom(socket, data);
      });

      // Disconnect
      socket.on("disconnect", async () => {
        await this.handleDisconnect(socket);
      });

      // Request room state
      socket.on("request-room-state", async (data: { roomId: number }) => {
        await this.handleRequestRoomState(socket, data);
      });

      // Heartbeat
      socket.on("heartbeat", async (data: { userId: number }) => {
        await this.handleHeartbeat(socket, data);
      });
    });
  }

  private async handleJoinRoom(socket: Socket, data: { roomId: number; userId: number; participantName: string }) {
    const { roomId, userId, participantName } = data;

    // Store session info
    this.userSessions.set(socket.id, { userId, roomId });

    // Join Socket.io room
    socket.join(`room-${roomId}`);

    // Add to participants set
    if (!this.roomParticipants.has(roomId)) {
      this.roomParticipants.set(roomId, new Set());
    }
    this.roomParticipants.get(roomId)!.add(socket.id);

    // Save session to database
    const db = await getDb();
    if (db) {
      await db.insert(websocketSessions).values({
        userId,
        sessionId: socket.id,
        roomId,
        socketId: socket.id,
        isActive: 1,
        connectedAt: new Date(),
        lastHeartbeatAt: new Date(),
      });
    }

    // Broadcast participant joined
    this.io.to(`room-${roomId}`).emit("participant-joined", {
      participantId: userId,
      participantName,
      timestamp: Date.now(),
    });

    // Send current participants to new user
    const participants = this.getParticipants(roomId);
    socket.emit("room-participants", { participants });

    console.log(`[WebSocket] User ${participantName} joined room ${roomId}`);
  }

  private async handleSendMessage(socket: Socket, message: RoomMessage) {
    const session = this.userSessions.get(socket.id);
    if (!session) return;

    const { roomId } = session;

    // Broadcast message to room
    this.io.to(`room-${roomId}`).emit("message", {
      ...message,
      timestamp: Date.now(),
    });

    // Save to database
    const db = await getDb();
    if (db) {
      await db.insert(roomMessages).values({
        roomId,
        participantId: message.participantId,
        content: message.content,
        mode: message.mode as any,
        temperature: message.temperature as any,
      });
    }

    console.log(`[WebSocket] Message in room ${roomId} from ${message.participantName}`);
  }

  private handleTyping(socket: Socket, data: { roomId: number; participantName: string }) {
    const { roomId, participantName } = data;

    // Broadcast typing indicator
    socket.to(`room-${roomId}`).emit("participant-typing", {
      participantName,
      timestamp: Date.now(),
    });
  }

  private handleStopTyping(socket: Socket, data: { roomId: number; participantName: string }) {
    const { roomId, participantName } = data;

    // Broadcast stop typing
    socket.to(`room-${roomId}`).emit("participant-stop-typing", {
      participantName,
      timestamp: Date.now(),
    });
  }

  private async handleLeaveRoom(socket: Socket, data: { roomId: number }) {
    const { roomId } = data;
    const session = this.userSessions.get(socket.id);

    if (session) {
      // Remove from participants set
      this.roomParticipants.get(roomId)?.delete(socket.id);

      // Update database
      const db = await getDb();
      if (db) {
        await db
          .update(websocketSessions)
          .set({
            isActive: 0,
            disconnectedAt: new Date(),
          })
          .where(eq(websocketSessions.sessionId, socket.id));
      }

      // Leave Socket.io room
      socket.leave(`room-${roomId}`);

      // Broadcast participant left
      this.io.to(`room-${roomId}`).emit("participant-left", {
        participantId: session.userId,
        timestamp: Date.now(),
      });

      console.log(`[WebSocket] User left room ${roomId}`);
    }
  }

  private async handleDisconnect(socket: Socket) {
    const session = this.userSessions.get(socket.id);

    if (session) {
      const { roomId } = session;

      // Clean up
      this.roomParticipants.get(roomId)?.delete(socket.id);
      this.userSessions.delete(socket.id);

      // Update database
      const db = await getDb();
      if (db) {
        await db
          .update(websocketSessions)
          .set({
            isActive: 0,
            disconnectedAt: new Date(),
          })
          .where(eq(websocketSessions.sessionId, socket.id));
      }

      // Broadcast disconnect
      this.io.to(`room-${roomId}`).emit("participant-disconnected", {
        timestamp: Date.now(),
      });

      console.log(`[WebSocket] Client disconnected: ${socket.id}`);
    }
  }

  private async handleRequestRoomState(socket: Socket, data: { roomId: number }) {
    const { roomId } = data;
    const db = await getDb();

    if (db) {
      // Get recent messages
      const messages = await db
        .select()
        .from(roomMessages)
        .where(eq(roomMessages.roomId, roomId))
        .limit(50);

      // Get active participants
      const participants = this.getParticipants(roomId);

      socket.emit("room-state", {
        roomId,
        messages,
        participants,
        timestamp: Date.now(),
      });
    }
  }

  private async handleHeartbeat(socket: Socket, data: { userId: number }) {
    const db = await getDb();
    if (db) {
      await db
        .update(websocketSessions)
        .set({
          lastHeartbeatAt: new Date(),
        })
        .where(eq(websocketSessions.sessionId, socket.id));
    }
  }

  private getParticipants(roomId: number): ParticipantPresence[] {
    const socketIds = this.roomParticipants.get(roomId) || new Set();
    const participants: ParticipantPresence[] = [];

    socketIds.forEach((socketId) => {
      const session = this.userSessions.get(socketId);
      if (session) {
        participants.push({
          participantId: session.userId,
          participantName: `User ${session.userId}`,
          status: "online",
          lastSeen: Date.now(),
        });
      }
    });

    return participants;
  }

  public getIO(): SocketIOServer {
    return this.io;
  }

  public broadcast(event: string, data: any) {
    this.io.emit(event, data);
  }

  public broadcastToRoom(roomId: number, event: string, data: any) {
    this.io.to(`room-${roomId}`).emit(event, data);
  }

  public getActiveConnections(): number {
    return this.io.engine.clientsCount;
  }
}

export default WebSocketServer;
