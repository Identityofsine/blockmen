from enum import Enum
import os


class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

class LogLevel(Enum):
		"""
		An enumeration for log levels.
		"""
		DEBUG = "DEBUG"
		INFO = "INFO"
		WARNING = "WARNING"
		ERROR = "ERROR"
		FATAL = "FATAL"


class LoggingEvent():
		"""
		A class to represent a logging event.
		"""

		def __init__(self, message: str, level: LogLevel):
				"""
				Initialize the LoggingEvent with a message and level.

				:param message: The log message.
				:param level: The log level (e.g., INFO, WARNING, ERROR).
				"""
				self.message = message
				self.level = level

		def __str__(self):
				"""
				Return a string representation of the LoggingEvent.

				:return: A string representation of the LoggingEvent.
				"""
				return f"{self.level}: {self.message}"

def logEvent(event: LoggingEvent):
		"""
		Log the event to the console.

		:param event: The LoggingEvent to log.
		"""
		match event.level:
			case LogLevel.DEBUG:
					# Only log debug messages if the environment variable is set
					if os.getenv("DEBUG") == "true":
							print(f"{bcolors.OKCYAN}[DEBUG] {event}{bcolors.ENDC}")
					else:
							pass
					pass
			case LogLevel.INFO:
					print(f"{bcolors.OKBLUE}[INFO] {event}{bcolors.ENDC}")
					pass
			case LogLevel.WARNING:
					print(f"{bcolors.WARNING}[WARNING] {event}{bcolors.ENDC}")
					pass
			case LogLevel.ERROR:
					print(f"{bcolors.FAIL}[ERROR] {event}{bcolors.ENDC}")
					pass
			case LogLevel.FATAL:
					print(f"{bcolors.FAIL}[FATAL] {event}{bcolors.ENDC}")
					pass


def log(message: str, level: str = "INFO"):
		"""
		Log a message with a specified level.

		:param message: The log message.
		:param level: The log level (e.g., INFO, WARNING, ERROR).
		"""
		event = LoggingEvent(message, LogLevel[level])
		logEvent(event)

def logDebug(message: str):
		"""
		Log a debug message.

		:param message: The log message.
		"""
		event = LoggingEvent(message, LogLevel.DEBUG)
		logEvent(event)

def logInfo(message: str):
		"""
		Log an info message.

		:param message: The log message.
		"""
		event = LoggingEvent(message, LogLevel.INFO)
		logEvent(event)

def logWarning(message: str):
		"""
		Log a warning message.

		:param message: The log message.
		"""
		event = LoggingEvent(message, LogLevel.WARNING)
		logEvent(event)

def logError(message: str):
		"""
		Log an error message.

		:param message: The log message.
		"""
		event = LoggingEvent(message, LogLevel.ERROR)
		logEvent(event)

