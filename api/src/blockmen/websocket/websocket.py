from abc import ABC
import asyncio
import websockets.asyncio
import websockets.asyncio.server as ws_server

from model.client.client import Client
from model.player.player import Player
from service.logger import logDebug, logInfo, logWarning



class WebSocketInterface():

	def __init__(self):
		self.socketRunning = False
		self.clients: list[Client] = []
		asyncio.run(self.init())
		pass

	async def init(self):
		"""
		Initialize the WebSocket server.
		"""
		self.server = await ws_server.serve(handler=self.on_connect, port=9090, host="0.0.0.0")
		self.socketRunning = True
		logInfo(f"WebSocket server started on 0.0.0.0:{9090}")
		await self.server.serve_forever();

	async def on_connect(self, server_connection: ws_server.ServerConnection):
		"""
		Handle a client connection.
		"""
		print(f"Client connected: {server_connection.remote_address}")
		self.clients.append(
			Player(self.clients.__len__() + 1, 0, server_connection, 0)
		)
		# non blocking listener
		await self.broadcast_helloworld()
		await self.catch_message(self.clients[-1])
		pass

	async def broadcast_helloworld(self):
		"""
		Broadcast a message to all connected clients.
		"""
		for client in self.clients:
			try:
				logDebug(f"Sending client {client.client_id} 'Hello World'")
				await client.getConnection().send("Hello World")
			except websockets.exceptions.ConnectionClosed:
				logWarning(f"Client {client.client_id} disconnected")
				self.clients.remove(client)

	async def catch_message(self, client: Client):
		"""
		Catch messages from a client.
		"""
		try:
			logDebug(f"Waiting for message from client {client.client_id}")
			request = await client.getConnection().recv()
			# run custom function 
			logDebug(f"Received message from client {client.client_id}: {request}")
			await self.catch_message(client)
		except websockets.exceptions.ConnectionClosed:
			logWarning(f"Client {client.client_id} disconnected")
			self.clients.remove(client)

