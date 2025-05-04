from service.logger import logDebug
from dotenv import load_dotenv
import os

load_dotenv()



logDebug(f"Hello World ({os.getenv('BRANCH')}:{os.getenv('BUILD_ID')} - {os.getenv('BUILD_DATE')})")

