from model.client import client
from websockets.asyncio.server import ServerConnection

class Player(client.Client):

	def __init__(self, client_id: int, group_id: int, conncetion:ServerConnection , player_id: int):
		super().__init__(client_id, group_id, conncetion)
		self.player_id = player_id
		
		self.x = int(0)
		self.y = int(0)

	def __repr__(self):
		return f"Player(client_id={self.client_id}, group_id={self.group_id}, player_id={self.player_id})"

	def move(self, direction: str):
		if direction == "up":
			self.y += 1
		elif direction == "down":
			self.y -= 1
		elif direction == "left":
			self.x -= 1
		elif direction == "right":
			self.x += 1