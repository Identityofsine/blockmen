from abc import ABC
from websockets.asyncio.server import ServerConnection

class Client(ABC):

	def __init__(self, client_id: int, group_id: int, connection: ServerConnection):
		self.client_id = client_id
		self.group_id = group_id
		self.connection = connection
	
	def __repr__(self):
		return f"Client(client_id={self.client_id}, group_id={self.group_id}"

	def getConnection(self) -> ServerConnection:
		return self.connection
