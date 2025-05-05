from model.client import client
from websockets.asyncio.server import ServerConnection

class Player(client.Client):

	def __init__(self, client_id: int, group_id: int, conncetion:ServerConnection , player_id: int):
		super().__init__(client_id, group_id, conncetion)
		self.player_id = player_id

	def __repr__(self):
		return f"Player(client_id={self.client_id}, group_id={self.group_id}, player_id={self.player_id})"
